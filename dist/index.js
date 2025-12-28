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
];
const GithubEvents = await (getEvent(username));
const formattedEvents = formatResponse(GithubEvents);
const simpleResponse = simplifyResponse(formattedEvents);
consoleResponse(simpleResponse);
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
function formatResponse(events) {
    return events.filter((event) => isKnownEventType(event.type))
        .map(event => ({ id: event.id, type: event.type, url: event.repo.url }));
}
function isKnownEventType(type) {
    return KnownEventTypes.includes(type);
}
function consoleResponse(events) {
    for (const event of events) {
        switch (event.type) {
            case "PushEvent":
                console.log(`- Pushed ${event.number} commit(s) to ${event.url.substring(29)}`);
                break;
            case "CreateEvent":
                console.log(`- Created ${event.number} repo(s) in ${event.url.substring(29)}`);
                break;
            default:
                console.log(`- ${event.type} ${event.number} time(s) in $${event.url.substring(29)}`);
                break;
        }
    }
}
function simplifyResponse(events) {
    let number = 1;
    const simplifiedResponse = events.filter((event, index) => {
        try {
            if (event.type !== events[index + 1].type || event.url !== events[index + 1].url) {
                event.number = number;
                number = 1;
                return true;
            }
            else {
                number++;
                return false;
            }
        }
        catch (err) {
            event.number = 1;
            return true;
        }
    });
    return simplifiedResponse;
}
export {};
