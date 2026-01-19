import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="not-found">
            <h2>Game Not Found</h2>
            <p>The game you’re looking for doesn’t exist.</p>

            <Link to="/">Back to Home</Link>
        </div>
    );
}
