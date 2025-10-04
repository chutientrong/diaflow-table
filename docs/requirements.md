
[Front-End Developer] Technical Test
## Frontend Technical Test — React Data Table
Build a lightweight table editor that supports:
- Lazy loading (infinite scroll) from a public JSON endpoint
- Correctness & stability of core features
### Data Source
- Use this public dataset:
GET https://microsoftedge.github.io/Demos/json-dummy-data/5MB.json
- Assume/derive a unique id per row.
- State/Created date doesn’t exist in dummy data, you can use any string or fixed value for their
### Requirements
- Lazy load / infinite scroll
- Render an initial slice; append more rows as the user scrolls.
### Tech (pre-suggestion, not mandatory)
- React 18+ (TypeScript preferred).
- You may use any libraries you like. Examples:
+ UI: shadcn/ui, Radix UI, MUI, Antd or your own components.
+ State/data: Redux Toolkit (+ RTK Query) or Zustand/SWR/React Query, anything that you want to use.
- Forms/validation.
### Deliverables
- A Git repo with:
- Source code
- README with setup/run instructions and a short note on decisions/trade-offs
- demo link(optional).
