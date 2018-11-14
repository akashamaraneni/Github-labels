const execSync = require('child_process').execSync;
const readline = require('readline');
var fs = require('fs');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("\n Intelligaia GITHUB Labels and Issues  \n------------------------------------------------------");

rl.question('Please enter your GITHUB user name, password and repository name:', (data) => {

  let labels = ["bug", "duplicate", "enhancement", "invalid", "question", "wontfix", "help%20wanted", "good%20first%20issue"];
  let newLabelData = ['{"name":"Task: Design","color":"f4bbb0"}', '{"name":"Task: HTML","color":"f4bbb0"}', '{"name":"Task: QA","color":"f4bbb0"}', '{"name":"Task: Ready to Retest","color":"f4bbb0"}', '{"name":"Task: Review with Client","color":"f4bbb0"}', '{"name":"Task: Video","color":"f4bbb0"}', '{"name":"Issue: None","color":"0052cc"}', '{"name":"Issue: Regression Testing","color":"0052cc"}', '{"name":"Issue: Responsive","color":"0052cc"}', '{"name":"Issue: Sunil Feedback","color":"0052cc"}', '{"name":"Type: Bug","color":"b60205"}', '{"name":"Type: Enhancement","color":"c5def5"}', '{"name":"Rally: S1","color":"b60205"}', '{"name":"Rally: S2","color":"d93f0b"}', '{"name":"Rally: S3","color":"d93f0b"}', '{"name":"Rally: S4","color":"fbca04"}', '{"name":"Rally: UI Integration","color":"73c2ce"}', '{"name":"P1","color":"b60205"}', '{"name":"P2","color":"d93f0b"}', '{"name":"P3","color":"fbca04"}', '{"name":"Status: Blocked","color":"b60205"}', '{"name":"Status: Feedback","color":"73c2ce"}', '{"name":"Status: In-Progress","color":"0e8a16"}', '{"name":"Release: June","color":"fbca04"}', '{"name":"Release: July","color":"fbca04"}', '{"name":"Release: August","color":"fbca04"}', '{"name":"Release: September","color":"fbca04"}'];
  let issues = ['{"title":"1. Discover(D1): Project Kick-off tasks for PM"}', '{"title":"2. Discover(D1): Documentation tasks for PM"}', '{"title":"6. Discover(D1): Create current customer journey map"}', '{"title":"3. Discover(D1): Project Planning task for PM"}', '{"title":"4. Discover(D1): Project Personas"}', '{"title":"5.Discover(D1): Collect Requirements/User Stories from Client"}'];

  data = data.split(' ');
  if (data.length === 3) { //To check for sufficiency of parameters
    fs.writeFile("Gitlog.txt", '', function (err) { //creating a file to collect log information.
      if (err) {
        return console.log(err);
      }
    });
    var text = "\n USER=" + data[0] + "\n PASS=" + data[1] + "\n REPO=" + data[2];
    text += "\n # Delete default labels";

    for (let label of labels)
      text += '\n curl --user "$USER:$PASS" --include --request DELETE "https://api.github.com/repos/$USER/$REPO/labels/' + label + '" >> Gitlog.txt';

    text += "\n # Create new labels";

    for (let label of newLabelData)
      text += '\n curl --user "$USER:$PASS" --include --request POST --data ' + "'" + label + "'" + ' "https://api.github.com/repos/$USER/$REPO/labels" >> Gitlog.txt';

    text += "\n # Create new issues";

    for (let issue of issues)
      text += '\n curl --user "$USER:$PASS" --include --request POST --data ' + "'" + issue + "'" + ' "https://api.github.com/repos/$USER/$REPO/issues" >> Gitlog.txt';

    fs.writeFile("label-issue.sh", text, function (err) { //creating a script file.
      if (err) {
        return console.log(err);
      }
      console.log("Deleting the existing labels, adding new labels and issues to GITHUB");
    });

    rl.close();

    setTimeout(() => {
      const output = execSync('label-issue.sh', { encoding: 'utf-8' });  // For executing the Bash Command      
    }, 1000);
  }
  else {
    rl.close();
    console.log("Insufficient parameters,terminating the project.  \n------------------------------------------------------");
  }  
  setTimeout(() => {
    var command = [];
    command.push("Start");

    for (let label of labels)
      command.push('\n curl --user "$USER:$PASS" --include --request DELETE "https://api.github.com/repos/$USER/$REPO/labels/' + label + '"');

    for (let label of newLabelData)
      command.push('\n curl --user "$USER:$PASS" --include --request POST --data ' + "'" + label + "'" + ' "https://api.github.com/repos/$USER/$REPO/labels"');

    for (let issue of issues)
      command.push('\n curl --user "$USER:$PASS" --include --request POST --data ' + "'" + issue + "'" + ' "https://api.github.com/repos/$USER/$REPO/issues"');

    console.log("\n------------------------Log------------------------------");
    fs.readFile('Gitlog.txt', 'utf8', function (err, contents) { //Reading log file.
      contents = contents.split('HTTP/1.1');
      for (let i = 1; i < contents.length; i++) {
        console.log("Log" + i + ")");
        console.log("Command: " + command[i]);
        console.log("Result: \n" + 'HTTP/1.1' + contents[i]);
      }
      console.log("\n-------------------------Completed---------------------------");
    });
  }, 1100);
});





