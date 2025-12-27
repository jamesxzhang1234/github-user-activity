#!/usr/bin/env node

const args = process.argv.slice(2);
const username = args[0];

console.log(await(getEvent(username)));

async function getEvent(username : string) {

    try {

        const response = await fetch(`https://api.github.com/users/${username}/events`)
        const data : [] = await response.json();
        return data;

    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
    }

}

