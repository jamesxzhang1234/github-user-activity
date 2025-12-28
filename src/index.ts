#!/usr/bin/env node

const args = process.argv.slice(2);
const username = args[0];
const KnownEventTypes = [

    "CommitCommentEvent",
    "CreateEvent",
    "DeleteEvent",
    "DiscussionEvent",
    "ForkEvent",
    "GollumEvent",
    "IssueCommentEvent",
    "IssuesEvent",
    "MemberEvent",
    "PublicEvent",
    "PullRequestEvent",
    "PullRequestReviewEvent",
    "PullRequestReviewCommentEvent",
    "PushEvent",
    "ReleaseEvent",
    "WatchEvent"
   
   ] as const;
   
   type knownEventType = typeof KnownEventTypes[number];

type GithubResponse = {

    id : string,
    type : string,
    repo: {
        url : string
    }

}

type formattedResponse = {

    id : string,
    type : knownEventType,
    url : string
    number? : number;
}


const GithubEvents : GithubResponse[] = await(getEvent(username));
const formattedEvents = formatResponse(GithubEvents);
const simpleResponse = simplifyResponse(formattedEvents);
consoleResponse(simpleResponse);

async function getEvent(username : string) : Promise<GithubResponse[]> {

    try {

        const response = await fetch(`https://api.github.com/users/${username}/events`)
        if(!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const data : GithubResponse[] = await response.json();
        return data;

    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        throw (err);
    }

}

function formatResponse(events : GithubResponse[]) : formattedResponse[] {

    return events.filter(

        (event) : event is GithubResponse & {type : knownEventType} => isKnownEventType(event.type))

        .map
        
        (event => ({id : event.id, type : event.type, url : event.repo.url})
    
    )
     
}

function isKnownEventType(type : string) : type is knownEventType {

    return KnownEventTypes.includes(type as knownEventType);

}

function consoleResponse(events : formattedResponse[]) {

    for (const event of events) {

        switch(event.type) {

            case "PushEvent" : console.log(`Pushed ${event.number} commit(s) to ${event.url.substring(29)}`); break; 
            case "CreateEvent" : console.log(`Created ${event.number} repo(s) in ${event.url.substring(29)}`); break;
            default : console.log(`${event.type}`); break;
    
        }
    
    }
    
}

function simplifyResponse (events : formattedResponse[]) {

    let number = 1;

    const simplifiedResponse : formattedResponse[] = events.filter((event, index) => {

        try {

            if (event.type !== events[index+1].type || event.url !== events[index+1].url) {
                event.number = number;
                number = 1;
                return true;
            } else {
                number++
                return false
            }

        } catch(err) {

            event.number = 1;
            return true;
            

        }

    } )

    return simplifiedResponse;

}

