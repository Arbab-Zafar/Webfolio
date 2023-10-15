const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 9999;

app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/websites', (req, res) => {
  res.sendFile(path.join(__dirname, 'websites.html'));
});

app.post('/msg', async (req, res) => {
  let original_data = JSON.parse(fs.readFileSync('msg.json'));//pervious data
  let data = req.body;

  let dateAndTime = getDateandTime();//getting array of values
  let dateObj = {
    date: dateAndTime[0],//getting date
    time: dateAndTime[1]//getting time
  }

  data = Object.assign(data, dateObj);//merging both objects(data and dateObj) in data

  original_data.push(data);//pushind data into original data
  original_data = JSON.stringify(original_data) + "\n";

  fs.writeFile('msg.json', original_data, (err) => {
    if (err) {
      console.log("err");
    }
    else {
      console.log("Data added successfully.")
    }
  });

  return res.redirect('back');
});

app.post("/contact", async (req, res) => {
  let data = JSON.parse(fs.readFileSync('contact.json'));

  let dateAndTime = getDateandTime();//getting array of values

  let obj = {
    name: req.body.Name,
    email: req.body.Email,
    phone: req.body.Phone,
    address: req.body.Address,
    message: req.body.Message,
    date: dateAndTime[0],//getting date
    time: dateAndTime[1]//getting time
  };

  data.push(obj);
  data = JSON.stringify(data) + "\n";
  fs.writeFile("contact.json", data, (err) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Data successfully added.")
    }
  });
  return res.redirect("back");
});

function getDateandTime() {
  let today_date = new Date();
  let hours = today_date.getHours();
  let minutes = today_date.getMinutes();
  let date = today_date.getDate();
  let month = today_date.getMonth();
  let year = today_date.getFullYear();

  meridiem = hours > 12 ? "P.M" : "A.M";
  hours = hours > 12 ? hours - 12 : hours;

  let finalDate = date + "/" + month + "/" + year;
  let finalTime = hours.toString() + ":" + minutes.toString() + " " + meridiem;
  let arr = [finalDate, finalTime];
  return arr;
}


app.listen(port, () => {
  console.log(`Website running at http://localhost:9999/`)
})