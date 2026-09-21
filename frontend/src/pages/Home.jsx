import { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
    const [search, setSearch]= useState("");
    const [problems, setProblems] = useState([]);
    const [selectedRating, setSelectedRating]= useState("All");
    const [hoveredProblem, setHoveredProblem]= useState(null);
    const [syncMessage, setSyncMessage]= useState("");
    const [syncing, setSyncing] = useState(false);
    const [lastSynced, setLastSynced]= useState(null);
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

    const syncProblems = async () => {
        try{
            setSyncing(true);
            setSyncMessage("");

            const response= await api.post("/codeforces/sync/hr145cp");
            console.log(response.data);
            
            if(response.data.added === 0){
                setSyncMessage("Already up to date!");
            }else if(response.data.added === 1){
                setSyncMessage("Synced! Added 1 problem");
            }else{
                setSyncMessage(`Synced! Added ${response.data.added} new problems`);
            }
            setLastSynced(new Date());

            const problemsResponse= await api.get("/problems");
            setProblems(problemsResponse.data);
        } catch(error){
            console.log(error);
            setSyncMessage("Sync failed!");
        } finally{
            setSyncing(false);
        }
    };

    const filteredProblems= problems.filter((problem) => {
        const ratingMatch= 
            selectedRating === "All" || problem.rating === selectedRating;

        const tagMatch=
            selectedTag === "All" || problem.tags.includes(selectedTag);

        const searchMatch= 
            problem.name.toLowerCase().includes(search.toLowerCase());

        return ratingMatch && tagMatch && searchMatch;
    });

    const recentProblems = [...problems]
        .filter((problem) => problem.solvedAt)
        .sort((a, b) => new Date(b.solvedAt)- new Date(a.solvedAt))
        .slice(0, 5)

    return (
        <div className= "min-h-screen bg-[#0f1117] text-white p-10">
            <div className= "w-full max-w-[1400px] mx-auto">
                <div className= "flex justify-between items-center mb-[30px]">
                    <div>
                        <h1 className= "text-[40px] m-0">
                            Codeforces Tracker
                        </h1>

                        <p className= "text-[#9ca3af] mt-2">
                            Tracking my Codeforces journey!
                        </p>
                    </div>
                    <div className= "px-4 py-2 rounded-[20px] bg-[#1f2937] border border-[#374151] text-[#60a5fa]">
                        @hr145cp
                    </div>
                    <button
                        onClick={syncProblems}
                        disabled= {syncing}
                        className={`px-4 py-2 rounded-lg border-none bg-[#2563eb] text-white font-bold ${
                            syncing
                                ? "cursor-not-allowed opacity-70"
                                : "cursor-pointer opacity-100"
                        }`}
                    >
                        {syncing ? "Syncing..." : "Sync Codeforces"}
                    </button>
                    {syncMessage && (
                        <p className= "text-[#60a5fa] my-2 text-sm">
                            {syncMessage}
                        </p>
                    )}
                    {lastSynced && (
                        <p className= "text-[#9ca3af] mt-[5px] text-xs">
                            Last synced: {lastSynced.toLocaleTimeString([], {
                                hour:"2-digit",
                                minute:"2-digit"
                            })}
                        </p>
                    )}
                </div>
                
                <div className= "flex flex-wrap gap-[15px] mb-[25px]">
                    <div className= "bg-[#1f2937] px-5 py-[15px] rounded-[10px] border border-[#374151]">
                        <p className= "text-[#9ca3af] m-0">
                            Total Solved
                        </p>

                        <h2 className="mt-[5px] mb-0">
                            {problems.length}
                        </h2>
                    </div>
                    <div className="bg-[#1f2937] px-5 py-[15px] rounded-[10px] border border-[#374151]">
                        <p className="text-[#9ca3af] m-0">
                            Ratings
                        </p>
                        <h2 className="mt-[5px] mb-0">
                            {ratings.length-1}
                        </h2>
                    </div>
                    <div className= "bg-[#1f2937] px-5 py-[15px] rounded-[10px] border border-[#374151]">
                        <p className="text-[#9ca3af] m-0">
                            Tags
                        </p>
                        <h2 className="mt-[5px] mb-0">
                            {tags.length-1}
                        </h2>
                    </div>
                </div>

                <input 
                    type= "text"
                    placeholder= "Search problem..."
                    value= {search}
                    onChange= {(e) => setSearch(e.target.value)}
                    className="w-full max-w-[700px] box-border p-3 mt-5 mb-[25px] rounded-lg border border-[#374151] bg-[#1f2937] text-white text-base"
                />
                <div className="mt-[25px] mb-[30px]">
                    <h2 className="mb-[15px]">
                        Latest Solved
                    </h2>

                    {recentProblems.map((problem) => (
                        <div
                            key= {problem._id}
                            onMouseEnter= {() => setHoveredProblem(problem._id)}
                            onMouseLeave= {() => setHoveredProblem(null)}
                            className={`bg-[#1f2937] p-[10px_15px] mt-2 rounded-lg border ${
                                hoveredProblem === problem._id
                                    ? "border-[#60a5fa] -translate-y-[3px]"
                                    : "border-[#374151] translate-y-0"
                            } transition-transform duration-200`}
                        >
                            <a
                                href={problem.problemUrl}
                                target= "_blank"
                                rel= "noreferrer"
                                className= "text-[#60a5fa] no-underline"
                            >
                                {problem.contestId}{problem.index}- {problem.name}
                            </a>

                            <span className= "text-[#9ca3af] ml-2.5 text-[13px]">
                                {new Date(problem.solvedAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))}

                </div>
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
                <div
                    style={{
                        display:"flex",
                        justifyContent:"space-between",
                        alignItems:"center",
                        marginTop:"30px",
                        marginBottom:"10px"
                    }}
                >
                    <h2 style={{margin:"0"}}>
                        Problems
                    </h2>
                    <p
                        style={{
                            color:"#9ca3af",
                            margin:"0"
                        }}
                    >
                        Showing {filteredProblems.length} of {problems.length}
                    </p>
                </div>
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
                            padding:"15px 18px",
                            marginTop:"10px",
                            borderRadius:"10px",
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
                        <h3 style={{ margin: "0 0 10px 0" , fontSize:"18px"}}>
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
                                {problem.contestId}{problem.index} - {problem.name}
                            </a>
                            
                        </h3>

                        <p
                            style={{
                                color: "#ffbf24",
                                fontWeight: "bold",
                                margin:"8px 0"
                            }}
                        >
                            Rating: {problem.rating}
                        </p>
                        <p
                            style={{
                                color:"#9ca3af",
                                margin:"8px 0"
                            }}
                        >
                            Solved: {new Date(problem.solvedAt).toLocaleDateString()}
                        </p>
                        <div
                            style={{
                                display:"flex",
                                flexWrap:"wrap",
                                gap:"6px",
                                marginTop:"10px"
                            }}
                        >
                            {problem.tags.map((tag) => (
                                <span
                                    key={tag}
                                    style={{
                                        padding:"4px 9px",
                                        borderRadius:"12px",
                                        backgroundColor:"#111827",
                                        color:"#9ca3af",
                                        fontSize:"13px",
                                        border:"1px solid #374151"
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;