import { Student, Tag, Relation, TokenizedRelationEntry, ASTNode, TokenType, Team } from '../types'
import * as LPModel from 'lp-model'
import {v4 as uuidv4} from 'uuid';

// Find @ mention context at cursor position
export const findMentionContext = (text: string, position: number) => {
  const beforeCursor = text.slice(0, position)
  const lastAtIndex = beforeCursor.lastIndexOf('@')

  if (lastAtIndex === -1) return null

  const afterAt = beforeCursor.slice(lastAtIndex + 1)
  // Check if there's a space after @ (which would end the mention)
  if (afterAt.includes(' ')) return null

  return {
    atIndex: lastAtIndex,
    searchTerm: afterAt.toLowerCase()
  }
}

// Parse relation into validated relation with tokens (AND, OR, NOT, parens)
// Returns null if the relation is invalid
export const tokenizeRelation = (text: string): TokenizedRelationEntry[] | null => {

  const res: TokenizedRelationEntry[] = [];
  let currentText = "";

  text += " "; // add a space to force the last character to be processed

  const studentMentionRegex = /^@\[.+?\]\([a-zA-Z0-9-]+\)$/;
  const tagMentionRegex = /^#\[.+?\]\([a-zA-Z0-9-]+\)$/;

  for (let i = 0; i < text.length; i++) {
    const currentCharacter = text[i];
    const currentTextUpper = currentText.toUpperCase();
    if (/\s/.test(currentCharacter)) {
      // ignore if nothing came before this space
      if (currentText.length > 0) {
        if (currentTextUpper === "AND" || currentTextUpper === "OR" || currentTextUpper === "NOT") {
          res.push({ type: currentTextUpper });
        }
        else if (studentMentionRegex.test(currentText)) {
          res.push({ type: "STUDENT", id: currentText.slice(currentText.lastIndexOf("(") + 1, currentText.lastIndexOf(")")) });
        }
        else if (tagMentionRegex.test(currentText)) {
          res.push({ type: "TAG", id: currentText.slice(currentText.lastIndexOf("(") + 1, currentText.lastIndexOf(")")) });
        }
        else {
          return null;
        }
        currentText = "";
      }
    }
    else if ((currentCharacter === "(" || currentCharacter === ")") && currentText.length === 0) {
      if (currentTextUpper === "AND" || currentTextUpper === "OR" || currentTextUpper === "NOT") {
        res.push({ type: currentTextUpper });
        res.push({ type: currentCharacter });
        currentText = "";
      }
      else if (currentText.length === 0) {
        res.push({ type: currentCharacter });
      }
    }
    else {
      currentText += currentCharacter;
    }
  }

  // if the string ends without whitespace or parenthesis
  if (currentText.length > 0) {
    if (currentText === "AND" || currentText === "OR" || currentText === "NOT") {
      res.push({ type: currentText });
    }
    else {
      return null;
    }
  }

  return res;
}

// Validate relation entries using parseRelation
export const validateRelation = (value: string): boolean => {
  const parsed = tokenizeRelation(value);
  if (parsed === null) {
    return false;
  }

  let openParenthesis = 0;
  let previousEntryType: TokenType | null = null;
  for (const entry of parsed) {
    if (entry.type === "(") {
      openParenthesis++;
    }
    else if (entry.type === ")") {
      if (openParenthesis === 0) {
        return false; // Unmatched closing parenthesis
      }
      openParenthesis--;
    }
    else if (entry.type === "AND" || entry.type === "OR") {
      if (previousEntryType === null || previousEntryType === "AND" || previousEntryType === "OR" || previousEntryType === "NOT" || previousEntryType === "(") {
        return false; // AND/OR cannot be first or follow AND/OR/NOT/(
      }
    }
    else if (entry.type === "NOT") {
      if (previousEntryType === "STUDENT" || previousEntryType === "TAG" || previousEntryType === ")") {
        return false; // NOT cannot follow student/tag/)
      }
    }

    previousEntryType = entry.type;
  }

  if (openParenthesis !== 0 || previousEntryType === "AND" || previousEntryType === "OR" || previousEntryType === "NOT") {
    return false;
  }

  return true;
}

const createAbstractSyntaxTreeForTokens = (tokens: TokenizedRelationEntry[], students: Student[]): ASTNode => {
  // split on ands and ors
  let parenthesisCount = 0;
  for (let i = 0; i < tokens.length; i++) {
    const tokenType = tokens[i].type;
    if (tokenType === "(") {
      parenthesisCount++;
    }
    else if (tokenType === ")") {
      parenthesisCount--;
    }
    else if (parenthesisCount === 0) {
      if (tokenType === "AND" || tokenType === "OR") {
        return {
          id: uuidv4(),
          type: tokenType,
          left: createAbstractSyntaxTreeForTokens(tokens.slice(0, i), students),
          right: createAbstractSyntaxTreeForTokens(tokens.slice(i + 1), students)
        }
      }
    }
  }

  const firstToken = tokens[0];
  // if there are no top level ands or ors, check if this is a not
  if (firstToken.type === "NOT") {
    return {
      id: uuidv4(),
      type: "NOT",
      child: createAbstractSyntaxTreeForTokens(tokens.slice(1), students)
    }
  }

  // if there are no ands, ors, or nots, remove any parenthesis
  if (firstToken.type === "(" && tokens[tokens.length - 1].type === ")") {
    return createAbstractSyntaxTreeForTokens(tokens.slice(1, tokens.length - 1), students);
  }

  // otherwise this must be a student or tag
  if (firstToken.type === "STUDENT") {
    return {
      type: firstToken.type,
      id: firstToken.id
    }
  }

  // tags are just treated as or statements of students with that tag
  if (firstToken.type === "TAG") {
    const studentsWithTag = students.filter(s => s.tags.includes(firstToken.id));
    if (studentsWithTag.length === 0) {
      return {
        type: "TRUE",
        id: uuidv4()
      };
    }
    else {
      return studentsWithTag.slice(1).reduce<ASTNode>((acc, curr) => ({
        id: uuidv4(),
        type: "OR",
        left: acc,
        right: {
          type: "STUDENT",
          id: curr.id
        }
      }), {
        type: "STUDENT",
        id: studentsWithTag[0].id
      });
    }
  }

  throw new Error("Invalid token sequence");
}

const createAbstractSyntaxTreeForRelation = (relation: Relation, students: Student[]): ASTNode => {
  const tokenized = tokenizeRelation(relation.value);
  if (tokenized === null) {
    throw new Error("Invalid relation entries");
  }

  return createAbstractSyntaxTreeForTokens(tokenized, students);
}

export const createAbstractSyntaxTree = (relations: Relation[], students: Student[]): ASTNode => {
  if (relations.length === 1) {
    return createAbstractSyntaxTreeForRelation(relations[0], students);
  }
  else {
    return relations.slice(1).reduce((acc, curr) => ({
      id: uuidv4(),
      type: 'AND',
      left: acc,
      right: createAbstractSyntaxTreeForRelation(curr, students)
    }), createAbstractSyntaxTreeForRelation(relations[0], students));
  }
}

const getVariableForAstNode = (node: ASTNode, group: number, model: LPModel.Model, variables: {[key: string]: LPModel.Variable}): LPModel.Variable => {
  if (variables[node.id]) {
    return variables[node.id];
  }

  const variable = model.addVar({ name: `${node.id}_group_${group}`, type: "binary" });
  variables[node.id] = variable;
  return variable;
}

const addAstConstraintsToModel = (node: ASTNode, model: LPModel.Model, variables: {[key: string]: LPModel.Variable}, group: number) => {
  if (node.type === "AND") {
    const nodeVar = getVariableForAstNode(node, group, model, variables);
    const leftVar = getVariableForAstNode(node.left, group, model, variables);
    const rightVar = getVariableForAstNode(node.right, group, model, variables);
    // Constraints for AND:
    // parent ≤ leftChild
    // parent ≤ rightChild
    // parent ≥ leftChild + rightChild - 1
    model.addConstr([[1, nodeVar], [-1, leftVar], "<=", 0])
    model.addConstr([[1, nodeVar], [-1, rightVar], "<=", 0])
    model.addConstr([[1, nodeVar, [-1, leftVar], [-1, rightVar]], "GE", -1])
    addAstConstraintsToModel(node.left, model, variables, group)
    addAstConstraintsToModel(node.right, model, variables, group)
  }
  else if (node.type === "OR") {
    const nodeVar = getVariableForAstNode(node, group, model, variables);
    const leftVar = getVariableForAstNode(node.left, group, model, variables);
    const rightVar = getVariableForAstNode(node.right, group, model, variables);
    // Constraints for OR:
    // parent ≥ leftChild
    // parent ≥ rightChild
    // parent ≤ leftChild + rightChild
    model.addConstr([[1, nodeVar], [-1, leftVar], ">=", 0])
    model.addConstr([[1, nodeVar], [-1, rightVar], ">=", 0])
    model.addConstr([[1, nodeVar, [-1, leftVar], [-1, rightVar]], "LE", 0])
    addAstConstraintsToModel(node.left, model, variables, group)
    addAstConstraintsToModel(node.right, model, variables, group)
  }
  else if (node.type === "NOT") {
    const nodeVar = getVariableForAstNode(node, group, model, variables);
    const childVar = getVariableForAstNode(node.child, group, model, variables);
    // Constraints for NOT:
    // parent + child = 1
    model.addConstr([[1, nodeVar], [1, childVar], "=", 1])
    addAstConstraintsToModel(node.child, model, variables, group)
  }
  
}

const addTeamSizeConstraintsToModel = (numTeams: number, students: Student[], model: LPModel.Model, variables: {[key: string]: LPModel.Variable}) => {
  const minTeamSize = Math.floor(students.length / numTeams);
  const maxTeamSize = Math.ceil(students.length / numTeams);

  for (let i = 0; i < numTeams; i++) {
    const greaterThanConstraint = [];
    const lessThanConstraint = [];
    for (const student of students) {
      const studentGroupVar = getVariableForAstNode({ type: "STUDENT", id: student.id }, i, model, variables);
      greaterThanConstraint.push([1, studentGroupVar]);
      lessThanConstraint.push([1, studentGroupVar]);
    }
    greaterThanConstraint.push(...[">=", minTeamSize])
    lessThanConstraint.push(...["<=", maxTeamSize])
    model.addConstr(greaterThanConstraint);
    model.addConstr(lessThanConstraint);
  }
}

const addStudentCountConstraintsToModel = (numTeams: number, students: Student[], model: LPModel.Model, variables: {[key: string]: LPModel.Variable}) => {
  for (const student of students) {
    const constraint = [];
    for (let i = 0; i < numTeams; i++) {
      const studentGroupVar = getVariableForAstNode({ type: "STUDENT", id: student.id }, i, model, variables);
      constraint.push([1, studentGroupVar]);
    }
    constraint.push(...["=", 1])
    model.addConstr(constraint);
  }
}

const setModelObjective = (relations: Relation[], model: LPModel.Model, variables: {[key: string]: LPModel.Variable}, students: Student[]) => {
  const objectiveParams = [];
  for (const relation of relations) {
    objectiveParams.push([relation.priority, variables[relation.id]]);
  }
  model.setObjective(objectiveParams, "maximize");
}

export const generateTeams = (relations: Relation[], numTeams: number, students: Student[]): Team[] => {
  const ast = createAbstractSyntaxTree(relations, students);
  const model = new LPModel.Model();
  const variables: {[key: string]: LPModel.Variable} = {};


  addTeamSizeConstraintsToModel(numTeams, students, model, variables);
  addStudentCountConstraintsToModel(numTeams, students, model, variables);
  for (let i = 0; i < numTeams; i++) {
    addAstConstraintsToModel(ast, model, variables, i);
  }

  setModelObjective(relations, model, variables, students);

  const result = model.solve("highs");

  console.log(result);

  return [];
}