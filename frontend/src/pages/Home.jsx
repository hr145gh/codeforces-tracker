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
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#0f1117",
                color:"white",
                padding: "40px"
            }}
        >
            <h1
                style={{
                    fontSize:"40px",
                    marginBottom:"10px"
                }}
            >Codeforces Tracker</h1>
            <p
                style={{
                    color:"#9ca3af",
                    fontSize:"18px"
                }}
            >Problem solved: {problems.length}</p>
            <input 
                type= "text"
                placeholder= "Search problem..."
                value= {search}
                onChange= {(e) => setSearch(e.target.value)}
                style={{
                    width:"100%",
                    maxWidth:"500px",
                    padding:"12px",
                    marginTop:"20px",
                    marginBottom:"25px",
                    borderRadius:"8px",
                    border:"1px solid #374151",
                    backgroundColor:"#1f2937",
                    color:"white",
                    fontSize:"16px"
                }}
            />
            <h2>Rating</h2>
            <div>
                {ratings.map((rating) => (
                    <button
                        key= {rating}
                        onClick= {() => setSelectedRating(rating)}
                        style= {{
                            padding:"8px 14px",
                            margin:"5px",
                            borderRadius:"20px",
                            border:"1px solid #374151",
                            cursor:"pointer",
                            backgroundColor:
                                selectedRating === rating ? "#2563eb" : "#1f2937",
                            color:"white",
                            fontWeight:
                                selectedRating === rating ? "bold" : "normal"
                        }}
                    >
                        {rating}
                    </button>
                ))}
            </div>
            <h2>Tags</h2>
            <div>
                {tags.map((tag) => (
                    <button
                        key= {tag}
                        onClick= {() => setSelectedTag(tag)}
                        style= {{
                            padding:"8px 14px",
                            margin:"5px",
                            borderRadius:"20px",
                            border:"1px solid #374151",
                            cursor:"pointer",
                            backgroundColor:
                                selectedTag === tag ? "#2563eb" : "#1f2937",
                            color:"white",
                            fontWeight:
                                selectedTag === tag ? "bold" : "normal"
                        }}
                    >
                        {tag}
                    </button>
                ))}
            </div>
            <h2>Problems</h2>
            {filteredProblems.map((problem) => (
                <div 
                    key= {problem._id}
                    style={{
                        backgroundColor:"#1f2937",
                        padding:"20px",
                        marginTop:"15px",
                        borderRadius:"12px",
                        border:"1px solid #374151"
                    }}
                >
                    <h3 style={{ margin: "0 0 10px 0" }}>
                        <a 
                            href={problem.problemURL}
                            target= "_blank"
                            rel="noreferrer"
                            style={{
                                color:"#60a5fa",
                                textDecoration: "none"
                            }}
                        >
                            {problem.contestId}{problem.index}- {problem.name}
                        </a>
                        
                    </h3>

                    <p style={{color: "#d1d5db"}}>Rating: {problem.rating}</p>
                    <p style={{color: "#9ca3af"}}>Tags: {problem.tags.join(", ")}</p>
                </div>
            ))}
        </div>
    );
}

export default Home;