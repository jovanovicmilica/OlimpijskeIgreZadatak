const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  const groups = require('./groups.json');


  const kolo=3;
  var makeTeam=[];
  var doubleName=[];

  var utakmice = [];

  function getRandomTeam(){
    return  Math.floor(Math.random() * 4);
  }


  function randomPoints(brojPoenaSuparnika){
    ////recimo da broj poena po timu moze biti izmedju 50 i 100

    ///da se ne desi isti broj poena
    
    let protivnikBrojPoena = Math.floor(Math.random() * 51 + 50);

    if(brojPoenaSuparnika!=0){
      while(brojPoenaSuparnika!=protivnikBrojPoena){
        return protivnikBrojPoena;
      }
    }
    else{
      return protivnikBrojPoena;
    }

  }

  function makeTeams(group,groupName,kolo){
    makeTeam=[];
    doubleName=[];

    ///biram jedan random tim
    let team1 = getRandomTeam();
    makeTeam.push(team1);
    doubleName.push(group[team1]);
    ///protivnicki random tim razlicit od prvog






    let team2 = getRandomTeam();
    while(makeTeam.includes(team2)){
      team2 = getRandomTeam();
    }

    


    doubleName.push(group[team2]);
    makeTeam.push(team2);

    //preostala dva tima
    let team3 = getRandomTeam();
    let team4 = getRandomTeam();
    while(makeTeam.includes(team3)){
      team3 = getRandomTeam();
    }
    doubleName.push(group[team3]);
    makeTeam.push(team3);
    while(makeTeam.includes(team4)){
      team4 = getRandomTeam();
    }
    doubleName.push(group[team4]);
    makeTeam.push(team4);

    //ovo vrv moze bolje ^
    
    var utakmica = {"utakmica":{
      "kolo":kolo,
      "tim1":group[team1].Team,
      "tim2":group[team2].Team,
      "tim3":group[team3].Team,
      "tim4":group[team4].Team,
    }};

    utakmice.push(utakmica);


    let brojPoenaTim1 = randomPoints(0);
    let brojPoenaTim2 = randomPoints(brojPoenaTim1);
    let brojPoenaTim3 = randomPoints(0);
    let brojPoenaTim4 = randomPoints(brojPoenaTim3);
    

    ///ukupni kosevi po timu
    group[team1].postignutiKosevi+=brojPoenaTim1;
    group[team2].postignutiKosevi+=brojPoenaTim2;
    group[team3].postignutiKosevi+=brojPoenaTim3;
    group[team4].postignutiKosevi+=brojPoenaTim4;


    function rezultati(tim1Index,tim2Index,poeniTim1,poeniTim2){

      //kosevi primljeni
      group[tim1Index].primljeniKosevi+=poeniTim2;
      group[tim2Index].primljeniKosevi+=poeniTim1;


      if(poeniTim1<poeniTim2){
        ///tim2 Pobeda
        group[tim1Index].porazi++;
        group[tim2Index].pobede++;

        //poeni
        group[tim1Index].points+=1;
        group[tim2Index].points+=2;

      }
      if(poeniTim1>poeniTim2){
        //tim1 Pobeda
        group[tim1Index].pobede++;
        group[tim2Index].porazi++;

        group[tim1Index].points+=2;
        group[tim2Index].points+=1;
      }
    }

    rezultati(team1,team2,brojPoenaTim1,brojPoenaTim2);
    rezultati(team3,team4,brojPoenaTim3,brojPoenaTim4);



    console.log(`\tGrupa ${groupName}`);
    console.log(`\t\t${group[team1].Team} - ${group[team2].Team} (${brojPoenaTim1} : ${brojPoenaTim2})`);
    console.log(`\t\t${group[team3].Team} - ${group[team4].Team} (${brojPoenaTim3} : ${brojPoenaTim4})`);

    // utakmice.tim=group[team1].Team;
    // utakmice.tim=group[team2].Team;
    // utakmice.tim=group[team3].Team;
    // utakmice.tim=group[team4].Team;


    
  }

  function addPropreties(grupa){
    for(let i=0;i<grupa.length;i++){
      grupa[i].pobede=0;
      grupa[i].porazi=0;
      grupa[i].points=0;
      grupa[i].postignutiKosevi=0;
      grupa[i].primljeniKosevi=0;
    }
  }

  addPropreties(groups.A);
  addPropreties(groups.B);
  addPropreties(groups.C);

  


  ///3 kola igre
  for(let i=0;i<kolo;i++){
    console.log(`Kolo ${i+1}`);
    makeTeams(groups.A,"A",i+1);
    makeTeams(groups.B,"B",i+1);
    makeTeams(groups.C,"C",i+1);
  }


  function rezultatiGrupneFaze(grupa,key){
    console.log(`\nGrupa ${key} RB / Ime / pobede/porazi/bodovi/postignuti koševi/primljeni koševi/koš razlika`);
    for(let i=0;i<grupa.length;i++){
      console.log(`\t${i+1}. ${grupa[i].Team} / ${grupa[i].pobede} / ${grupa[i].porazi} / ${grupa[i].points} / ${grupa[i].postignutiKosevi} / ${grupa[i].primljeniKosevi} / ${grupa[i].postignutiKosevi > grupa[i].primljeniKosevi ? "+" : "" }${grupa[i].postignutiKosevi - grupa[i].primljeniKosevi}`);
    }
  }
  
  console.log('\nKonačan plasman u grupama:');
  rezultatiGrupneFaze(groups.A,"A");
  rezultatiGrupneFaze(groups.B,"B");
  rezultatiGrupneFaze(groups.C,"C");

  
});
