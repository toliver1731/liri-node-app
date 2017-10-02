var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');

    
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    })

    var spotify = new Spotify({
      id: keys.spotifyKeys.id,
      secret: keys.spotifyKeys.secret
    });

var operator=process.argv[2];

switch(operator) {
    case("my-tweets"): {
        myTweets();
        return;
    }
    case("spotify-this-song"): {
        getSong();
        return;
    }
    case("movie-this"): {
        getMovie();      
        return;

    }
    case("do-what-it-says"): {
        fs.readFile('random.txt', 'utf8', function(err, data) {
            if(err) {
                return console.log(err);
                }
                var directions = data.split(", ");  
                console.log(directions[0]);
                console.log(directions[1]);
                
                switch(directions[0]) {
                    case "my-tweets": {
                        myTweets();
                        return;
                    }
                     case "movie-this": {
                        getMovie(directions[1]);
                        return
                    }
                   case "spotify-this-song": {
                        getSong(directions[1]);
                        return
                    }
                   
                }
            });
        return;
    }

   
}

function myTweets() {
    var params = {screen_name: "TheFakeTO2", count: 20};

    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if (!error) {
          for (var i = 0; i < tweets.length; i++) {
            console.log(`Created: ${tweets[i].created_at}\nTweet: ${tweets[i].text}\n`);
          }
        }
    })
}


function getMovie(movieName) {
        if (process.argv[3]) {
            var queryUrl = "http://www.omdbapi.com/?t=" + process.argv[3] + "&y=&plot=short&apikey=40e9cece";
          } else {
            var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
          }


    
        request(queryUrl, function(error, response, body) {
              if (!error && response.statusCode === 200) {
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Produced: " + JSON.parse(body).Country);
                console.log("Langauge: " + JSON.parse(body).Language);
                console.log("Plot: " +  JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
              }
        });
}

function getSong(songName) {
    var songName = process.argv[3];
        var limit = 10;

        if(!songName){
            spotify.search({ type: "track", query: "The Sign Ace of Base", limit: limit}, function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                
                for(var i = 0; i < limit; i++) {

                    console.log(`Result ${i+1}`);
                    console.log(`Artist(s) Name: ${data.tracks.items[i].artists[0].name}`); 
                    console.log(`Album Name: ${data.tracks.items[i].album.name}`); 
                    console.log(`Song Name: ${data.tracks.items[i].name}`);  
                    console.log(`Spotify Preview Link: ${data.tracks.items[i].external_urls.spotify}`); 
                    console.log(`Popularity: ${data.tracks.items[i].popularity}`); 
                    console.log(`\n`);
                }
            });
        } else {
            spotify.search({ type: 'track', query: songName, limit: limit}, function(err, data) {
              if (err) {
                return console.log('Error occurred: ' + err);
              }
            
                    console.log(`Search Results for Song: ${songName}`);
                    console.log(`\n`);

                for(var i = 0; i < limit; i++) {

                    console.log(`♬♬♬♬♬♬♬♬♬♬♬♬♬♬♬♬♬♬♬♬♬♬♬`);
                    console.log(`Result ${i+1}`);
                    console.log(`Artist(s) Name: ${data.tracks.items[i].artists[0].name}`); 
                    console.log(`Album Name: ${data.tracks.items[i].album.name}`); 
                    console.log(`Song Name: ${data.tracks.items[i].name}`);  
                    console.log(`Spotify Preview Link: ${data.tracks.items[i].external_urls.spotify}`); 
                    console.log(`Popularity: ${data.tracks.items[i].popularity}`); 
                    console.log(`\n`);
                }
            });
        }
}
