const axios= require("axios");

const getUserSubmissions= async(handle) => {
    let allSubmissions= [];
    let from= 1;
    const count=1000;

    while(true){
        const response= await axios.get(
            "https://codeforces.com/api/user.status",
            {
                params: {
                    handle: handle,
                    from: from,
                    count: count
                }
            }
        );

        const submissions= response.data.result;

        console.log("From:", from);
        console.log("Count requested:", count);
        console.log("Submissions fetched:", submissions.length);

        console.log("First submission id:", submissions[0]?.id);
        console.log("Last submission id:", submissions[submissions.length-1]?.id);

        if(submissions.length===0){
            break;
        }

        allSubmissions.push(...submissions);

        if(submissions.length<count){
            break;
        }

        from+=count;
    }
    

    const solvedSubmissions= allSubmissions.filter(
        submission => submission.verdict === "OK"
    );

    const uniqueProblems= new Map();

    solvedSubmissions.forEach(submission => {
        console.log(
            submission.problem.contestId,
            submission.problem.index,
            submission.problem.name
        );

        //here unique key is based on contestId + problem index
        const key=`${submission.problem.contestId}-${submission.problem.index}-${submission.problem.name}`;

        if(!uniqueProblems.has(key)){
            uniqueProblems.set(key, submission);
        }
    });

    console.log("Solved submissions:", solvedSubmissions.length);
    console.log("Unique problems:", uniqueProblems.size);

    return Array.from(uniqueProblems.values());
};



module.exports= {
    getUserSubmissions
};