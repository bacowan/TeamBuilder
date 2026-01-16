# Team Builder

[日本語](README.ja.md)

A web app for creating teams based on configurable constraints.

## How to Use

1. **Add students** - Enter the names of people you want to divide into teams
2. **Tag students** (optional) - Add tags to categorize students (e.g., "GoodPowerSkills", "GreenfieldGroup1")
3. **Define relations** - Create rules for how students should be grouped:
   - `@Alice` - Reference a specific student
   - `#GoodPowerSkills` - Reference all students with a tag
   - `AND` / `OR` / `NOT` - Combine conditions
   - Parentheses for grouping: `( @Alice OR @Bob ) AND #Frontent`
4. **Set priorities** - Give each relation a priority (higher = more important to satisfy)
5. **Generate teams** - Choose how many teams you want and click generate

## Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173/TeamBuilder/ in your browser.

### Deploy

```bash
npm run build
npm run deploy
```

This builds the project and deploys it to GitHub Pages.
