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
                <div className="mt-[25px] mb-5">
                    <h2 className="mb-2.5">
                        Rating
                    </h2>
                    <div className="flex flex-wrap">
                        {ratings.map((rating) => (
                            <button
                                key= {rating}
                                onClick= {() => setSelectedRating(rating)}
                                className= {`px-3.5 py-2 m-[5px] rounded-[20px] border border-[#374151] cursor-pointer text-white transition-all duration-200 hover:border-[#60a5fa] hover:-translate-y-[2px] ${
                                    selectedRating === rating
                                        ? "bg-[#2563eb] font-bold"
                                        : "bg-[#1f2937] font-normal hover:bg-[#263a5a]"
                                }`}
                            >
                                {rating}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-[30px]">
                    <h2 className="mb-2.5">
                        Tags
                    </h2>
                    <div className="flex flex-wrap">
                        {tags.map((tag) => (
                            <button
                                key= {tag}
                                onClick= {() => setSelectedTag(tag)}
                                className= {`px-3.5 py-2 m-[5px] rounded-[20px] border border-[#374151] cursor-pointer text-white transition-all duration-200 hover:border-[#60a5fa] hover:-translate-y-[2px] ${
                                    selectedTag === tag
                                        ? "bg-[#2563eb] font-bold"
                                        : "bg-[#1f2937] font-normal hover:bg-[#263a5a]"
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between items-center mt-[30px] mb-2.5">
                    <h2 className="m-0">
                        Problems
                    </h2>
                    <p className= "text-[#9ca3af] m-0">
                        Showing {filteredProblems.length} of {problems.length}
                    </p>
                </div>
                {filteredProblems.length === 0 && (
                    <p className="text-[#9ca3af] mt-[30px]">
                        No problems found.
                    </p>
                )}
                {filteredProblems.map((problem) => (
                    <div 
                        key= {problem._id}
                        onMouseEnter={() => setHoveredProblem(problem._id)}
                        onMouseLeave={() => setHoveredProblem(null)}
                        className={`bg-[#1f2937] p-[15px_18px] mt-2.5 rounded-[10px] border ${
                            hoveredProblem === problem._id
                                ? "border-[#60a5fa] -translate-y-[3px]"
                                : "border-[#374151] translate-y-0"
                        } transition-transform duration-200`}
                    >
                        <h3 className="m-0 mb-2.5 text-[18px]">
                            <a 
                                href={problem.problemUrl}
                                target= "_blank"
                                rel="noreferrer"
                                className={`no-underline ${
                                    hoveredProblem === problem._id
                                        ? "text-[#93c5fd]"
                                        : "text-[#60a5fa]"
                                }`}
                            >
                                {problem.contestId}{problem.index} - {problem.name}
                            </a>
                            
                        </h3>

                        <p className="text-[#9ca3af] my-[5px]">
                            Rating: {problem.rating}
                        </p>
                        <p className="text-[#9ca3af] my-[5px]">
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