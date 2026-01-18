# FindMyClg - DSE College Finder

[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/awejofficial/findmyclg)

FindMyClg is a web application built to simplify the college search process for Direct Second Year (DSE) B.Tech engineering students in Maharashtra. It provides a personalized, data-driven approach to discover eligible colleges based on diploma aggregate marks, category, and preferences, using official CAP round cutoff data.

**Live Demo: [https://findmyclg.vercel.app](https://findmyclg.vercel.app)**

## ✨ Key Features

-   **Personalized College Matching**: Enter your diploma aggregate, category, and branch preferences to instantly receive a list of matching colleges.
-   **DSE-Focused**: Exclusively designed for diploma students seeking lateral entry into B.Tech programs in Maharashtra.
-   **Official Cutoff Data**: Utilizes verified government-published CAP cutoff data from Rounds I, II, and III for accurate eligibility checks.
-   **Smart Strategy Report**: Go beyond simple matching with a categorized report of your "Best Fit," "Safe," and "Dream" college options.
-   **Advanced Filtering & Sorting**: Easily filter results by city, branch, college type (Government, Private, etc.), and sort by eligibility, cutoff, or name.
-   **PDF Export**: Download your personalized college analysis report as a professionally formatted PDF to review and share.
-   **Intuitive UI**: A clean, modern, and responsive interface built with Tailwind CSS and shadcn/ui.

## 🛠️ Tech Stack

| Category      | Technology                                                                                                  |
| :------------ | :---------------------------------------------------------------------------------------------------------- |
| **Frontend**  | [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)     |
| **Styling**   | [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)                                |
| **Backend**   | [Supabase](https://supabase.io/) (PostgreSQL Database, Auth, Edge Functions)                                |
| **Deployment**| [Vercel](https://vercel.com/)                                                                               |

## 🚀 Getting Started

To run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/awejofficial/findmyclg.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd findmyclg
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Supabase project credentials. You can find these in your Supabase project settings.

    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:8080`.

## 📂 Project Structure

The repository is organized to separate concerns and facilitate maintainability:

```
/src
├── components/
│   ├── college-analysis/ # Core components for the analysis feature
│   ├── form-steps/       # Multi-step form components
│   └── ui/               # Reusable shadcn/ui components
├── contexts/             # React context providers
├── hooks/                # Custom React hooks
├── integrations/         # Supabase client and generated types
├── pages/                # Top-level page components for routing
├── services/             # Functions for database interaction
└── supabase/             # Supabase CLI configuration
    ├── functions/        # Edge functions (e.g., send-feedback)
    └── migrations/       # Database schema migrations
```

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to fix a bug, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature (`git checkout -b feature/YourFeatureName`).
3.  Make your changes and commit them (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeatureName`).
5.  Open a Pull Request.

## 🧑‍💻 About the Author

This project was created by **Awej Pathan**, a student and developer passionate about building practical solutions for students.

-   **GitHub**: [@awejofficial](https://github.com/awejofficial)
-   **LinkedIn**: [in/awejpathan](https://www.linkedin.com/in/awejpathan/)
