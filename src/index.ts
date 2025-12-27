#!/usr/bin/env node

const args = process.argv.slice(2);
const username = args[0];

const GithubEvents : GithubResponse[] = await(getEvent(username));
const formattedEvents = formatResponse(GithubEvents);


type GithubResponse = {

    id : string,
    type : string,
    repo: {
        url : string
    }

}

type formattedResponse = {

    id : string,
    type : string,
    url : string
}

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

    let EventTypesAndRepo : formattedResponse[]= [];
    events.forEach((element)=> {
        
        EventTypesAndRepo.push({

            id : element.id, 
            type : element.type,
            url : element.repo.url

        })
                        
    });

    return EventTypesAndRepo;

}

