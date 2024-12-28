# Next.js Website Builder with Puck

This is a Next.js project that implements a visual page builder using [@measured/puck](https://github.com/measuredco/puck). It allows both developers and non-developers to create and edit web pages through a visual interface.

## Features

- Visual page builder interface
- Multiple page management
- Dynamic component rendering
- Data-driven components with API integration
- Responsive layout support
- Component categories for better organization
- Real-time preview
- JSON-based page storage

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

- `/app` - Next.js application routes and pages
- `/components/blocks` - Reusable UI components for the page builder
- `/config` - Puck configuration files
- `/pages/api` - API routes for data and file handling
- `/data` - JSON storage for pages (auto-generated)

## Available Components

The page builder includes several pre-built components:

- **HeadingBlock** - For titles and headings
- **TextBlock** - For paragraphs and text content
- **ImageBlock** - For images with alt text support
- **ButtonBlock** - For call-to-action buttons
- **Iterator** - For repeatable content sections with data binding

## Usage

1. Navigate to `/editor` to access the page builder interface
2. Create a new page or select an existing one
3. Drag and drop components from the left sidebar
4. Configure component properties in the right sidebar
5. Save your changes
6. View the published page at `/view/[path]`

## API Endpoints

- `/api/pages` - GET/POST endpoints for page management
- `/api/items` - GET endpoint for dynamic content
- `/api/upload` - POST endpoint for file uploads
- `/api/zoneChildren` - GET endpoint for iterator zone components

## Configuration

The project uses several configuration files:

- `puck.config.ts` - Core component definitions
- `puck.client.tsx` - Client-side component configuration
- `puck.render.tsx` - Server-side rendering configuration

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Puck Editor Documentation](https://puck.style/docs)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
