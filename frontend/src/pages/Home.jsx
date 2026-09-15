import { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
    const [search, setSearch]= useState("");
    const [problems, setProblems] = useState([]);
    const [selectedRating, setSelectedRating]= useState("All");
    const ratings= [
        "All",
        ...new Set(
            problems
                .map((problem) => problem.rating)
                .filter((rating) => rating)
                .sort((a, b) => a-b)
        )
    ];

    const tags= [
        "All",
        ...new Set(
            problems
                .flatMap((problem) => problem.tags)
                .sort()
        )
    ];

    const [selectedTag, setSelectedTag] = useState("All");

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

    const filteredProblems= problems.filter((problem) => {
        const ratingMatch= 
            selectedRating === "All" || problem.rating === selectedRating;

        const tagMatch=
            selectedTag === "All" || problem.tags.includes(selectedTag);

        const searchMatch= 
            problem.name.toLowerCase().includes(search.toLowerCase());

        return ratingMatch && tagMatch && searchMatch;
    });

    return (
        <div>
            <h1>Codeforces Tracker</h1>
            <p>Problem solved: {problems.length}</p>
            <input 
                type= "text"
                placeholder= "Search problem..."
                value= {search}
                onChange= {(e) => setSearch(e.target.value)}
            />
            <div>
                {ratings.map((rating) => (
                    <button
                        key= {rating}
                        onClick= {() => setSelectedRating(rating)}
                        style= {{
                            backgroundColor: selectedRating === rating ? "black" : "white",
                            color: selectedRating === rating ? "white" : "black"
                        }}
                    >
                        {rating}
                    </button>
                ))}
            </div>
            <div>
                {tags.map((tag) => (
                    <button
                        key= {tag}
                        onClick= {() => setSelectedTag(tag)}
                        style= {{
                            backgroundColor: selectedTag === tag ? "black" : "white",
                            color: selectedTag === tag ? "white" : "black"
                        }}
                    >
                        {tag}
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