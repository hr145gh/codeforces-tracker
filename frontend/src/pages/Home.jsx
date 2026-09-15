import { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
    const [problems, setProblems] = useState([]);
    const [selectedRating, setSelectedRating]= useState("All");
    const ratings= [
        "All",
        800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500
    ];

    useEffect(() => {
        const fetchProblems= async () => {
            try {
                const response= await api.get("/problems");
                setProblems(response.data);
            } catch(error) {
                console.log(error);
            }
        };
        fetchProblems();
    }, []);

    const filteredProblems= selectedRating === "All"
        ? problems
        : problems.filter((problem) => problem.rating === selectedRating);

    return (
        <div>
            <h1>Codeforces Tracker</h1>
            <p>Problem solved: {problems.length}</p>
            <div>
                {ratings.map((rating) => (
                    <button
                        key= {rating}
                        onClick= {() => setSelectedRating(rating)}
                    >
                        {rating}
                    </button>
                ))}
            </div>

            {filteredProblems.map((problem) => (
                <div key= {problem._id}>
                    <h3>
                        <a href={problem.problemURL} target= "_blank">
                            {problem.contestId}{problem.index}- {problem.name}
                        </a>
                        
                    </h3>

                    <p>Rating: {problem.rating}</p>
                    <p>Tags: {problem.tags.join(", ")}</p>
                </div>
            ))}
        </div>
    );
}

export default Home;