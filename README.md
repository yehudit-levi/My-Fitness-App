# My Fitness Project — Collaborative Sports Exercises Platform

A full-stack web platform for coaches and trainees to share workout exercises. Coaches upload exercise videos and manage their content; users browse, favorite, and comment on exercises; admins approve coach upgrade requests. Originally built independently in 2024, and actively extended since 2025 in collaboration with [Claude](https://claude.com) (Anthropic's AI coding assistant).

## Features

- **JWT-based authentication** with role-aware personal areas for regular users, coaches, and admins.
- **Unified user/coach data model** — every account is a `User`; a self-service "become a coach" request goes through an admin-approval workflow (`IsCoach` flag + certification review) instead of duplicating account data across separate tables.
- **Exercise management** — coaches create, publish, and manage exercises with video demonstrations, categorized by difficulty and target audience.
- **Favorites & comments** — users can favorite exercises (many-to-many relationship) and leave comments.
- **Cloud-based media storage** — profile pictures, coach certifications, and exercise videos are uploaded to [Cloudinary](https://cloudinary.com) rather than the server's local disk, so uploaded content survives redeploys and scales independently of the API server. Videos are automatically transcoded to H.264/AAC on upload for universal browser playback.
- **Email notifications** — admins are notified by email when a coach upgrade request comes in; applicants are notified of the approval/rejection decision.
- **Admin panel** for reviewing and approving/rejecting pending coach upgrade requests.

## Tech Stack

**Backend**
- C# / ASP.NET Core 6 Web API
- Entity Framework Core 7 (SQL Server)
- AutoMapper
- JWT authentication
- Cloudinary .NET SDK (media storage)
- Swagger / Swashbuckle (API documentation)

**Frontend**
- React 18 + TypeScript
- Redux Toolkit + redux-persist
- React Router v6
- Material UI (MUI) v5
- Axios

## Architecture

The server follows a layered architecture:

```
Controllers  →  Service  →  Repository  →  DataContext (EF Core)
```

- Generic `IRepository<T>` / `IService<T>` interfaces keep CRUD logic consistent across entities.
- DTOs (`Common` project) decouple the API's public shape from the EF Core entities (`Repository.Entity`).
- `CloudinaryHelper` centralizes all cloud media upload logic used by the user, coach-request, and exercise services.

The client is a single-page React app with Redux-managed auth state (persisted to `localStorage`) and role-based routing/navigation.

## Getting Started

### Prerequisites
- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
- [Node.js](https://nodejs.org/) (v16+) and npm
- SQL Server (LocalDB is sufficient for local development)
- A free [Cloudinary](https://cloudinary.com) account (for media uploads)

### Server setup

1. Open `Server/Project1.sln` in Visual Studio.
2. Configure the required secrets via **Manage User Secrets** on the `Project1` project (never commit these to source control):

   ```json
   {
     "Jwt": {
       "Key": "<a long random secret>",
       "Issuer": "https://localhost:44363/",
       "Audience": "https://localhost:44363/"
     },
     "EmailSettings": {
       "Password": "<SMTP app password>"
     },
     "CloudinarySettings": {
       "CloudName": "<your Cloudinary cloud name>",
       "ApiKey": "<your Cloudinary API key>",
       "ApiSecret": "<your Cloudinary API secret>"
     }
   }
   ```

3. Update the `ConnectionStrings:DefaultConnection` value in `appsettings.json` if you're not using LocalDB.
4. Run the EF Core migrations (Package Manager Console, with **DataContext** set as the default project):
   ```
   Update-Database
   ```
5. Run the `Project1` API project (default: `https://localhost:7225`).

### Client setup

```bash
cd Client
npm install
npm start
```

The client runs at `http://localhost:3000` and expects the API at `https://localhost:7225` (see `src/Project/axios.ts` / API base URLs).

## Project Structure

```
Server/
  Project1/     — API entry point, controllers, configuration
  Service/      — business logic, Cloudinary integration
  Repository/   — EF Core entities and repositories
  DataContext/  — DbContext, migrations
  Common/       — shared DTOs
Client/
  src/Project/  — React app: pages, Redux slices, API clients, routing
```

## Notes on the Cloudinary migration

Earlier versions of this project stored uploaded files (profile pictures, coach certifications, exercise videos) on the API server's local disk. This was migrated to Cloudinary in two stages — images first, then video — because local disk storage doesn't survive a redeploy or restart on most modern hosting platforms, and doesn't scale across multiple server instances. Video uploads are explicitly transcoded to H.264/AAC on upload to guarantee playback compatibility across browsers, since phone-recorded video is frequently encoded with codecs (e.g. HEVC) that browsers don't support natively.
