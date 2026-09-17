import { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
    const [search, setSearch]= useState("");
    const [problems, setProblems] = useState([]);
    const [selectedRating, setSelectedRating]= useState("All");
    const [hoveredProblem, setHoveredProblem]= useState(null);
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
                minHeight:"100vh",
                backgroundColor:"#0f1117",
                color:"white",
                padding:"40px"
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth:"1400px",
                    margin:"0 auto"
                }}
            >
                <div 
                    style={{
                        display:"flex",
                        justifyContent:"space-between",
                        alignItems:"center",
                        marginBottom:"30px"
                    }}
                >
                    <div>
                        <h1
                            style={{
                                fontSize:"40px",
                                margin:"0"
                            }}
                        >
                            Codeforces Tracker
                        </h1>

                        <p
                            style={{
                                color:"#9ca3af",
                                marginTop:"8px"
                            }}
                        >
                            Tracking my Codeforces journey!
                        </p>
                    </div>
                    <div
                        style={{
                            padding:"10px 16px",
                            borderRadius:"20px",
                            backgroundColor:"#1f2937",
                            border:"1px solid #374151",
                            color:"#60a5fa"
                        }}
                    >
                        @hr145cp
                    </div>
                </div>
                
                <p
                    style={{
                        color:"#9ca3af",
                        fontSize:"18px"
                    }}
                >Problem solved: {problems.length} | Showing: {filteredProblems.length}</p>
                <input 
                    type= "text"
                    placeholder= "Search problem..."
                    value= {search}
                    onChange= {(e) => setSearch(e.target.value)}
                    style={{
                        width:"100%",
                        maxWidth:"700px",
                        boxSizing:"border-box",
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
                <div
                    style={{
                        marginTop:"25px",
                        marginBottom: "20px"
                    }}
                >
                    <h2 
                        style={{
                            marginBottom: "10px"
                        }}
                    >
                        Rating
                    </h2>
                    <div
                        style={{
                            display:"flex",
                            flexWrap:"wrap"
                        }}
                    >
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
                </div>
                <div
                    style={{
                        marginBottom: "30px"
                    }}
                >
                    <h2
                        style={{
                            marginBottom:"10px"
                        }}
                    >
                        Tags
                    </h2>
                    <div
                        style={{
                            display:"flex",
                            flexWrap:"wrap"
                        }}
                    >
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
                </div>
                <h2>Problems</h2>
                {filteredProblems.length === 0 && (
                    <p style={{color: "#9ca3af", marginTop: "30px"}}>
                        No problems found.
                    </p>
                )}
                {filteredProblems.map((problem) => (
                    <div 
                        key= {problem._id}
                        onMouseEnter={() => setHoveredProblem(problem._id)}
                        onMouseLeave={() => setHoveredProblem(null)}
                        style={{
                            backgroundColor:"#1f2937",
                            padding:"20px",
                            marginTop:"15px",
                            borderRadius:"12px",
                            border:
                                hoveredProblem === problem._id
                                    ? "1px solid #60a5fa"
                                    : "1px solid #374151",
                            transform:
                                hoveredProblem === problem._id
                                    ? "translateY(-3px)"
                                    : "translateY(0)",
                            transition: "transform 0.2s, border-color 0.2s"
                        }}
                    >
                        <h3 style={{ margin: "0 0 10px 0" }}>
                            <a 
                                href={problem.problemUrl}
                                target= "_blank"
                                rel="noreferrer"
                                style={{
                                    color: hoveredProblem === problem._id
                                            ? "#93c5fd"
                                            : "#60a5fa",
                                        textDecoration: "none"
                                }}
                            >
                                {problem.contestId}{problem.index}- {problem.name}
                            </a>
                            
                        </h3>

                        <p
                            style={{
                                color: "#ffbf24",
                                fontWeight: "bold"

                            }}
                        >
                            Rating: {problem.rating}
                        </p>
                        <p
                            style={{
                                color: "#9ca3af"
                            }}
                        >
                            Tags: {problem.tags.join(", ")}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;