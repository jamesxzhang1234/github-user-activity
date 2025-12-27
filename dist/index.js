#!/usr/bin/env node
const args = process.argv.slice(2);
const username = args[0];
const GithubEvents = await (getEvent(username));
console.log(getTypeAndRepo(GithubEvents));
async function getEvent(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/events`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        throw (err);
    }
}
function getTypeAndRepo(events) {
    let EventTypesAndRepo = [];
    events.forEach((element) => {
        EventTypesAndRepo.push({
            id: element.id,
            type: element.type,
            url: element.repo.url
        });
    });
    return EventTypesAndRepo;
}
export {};
