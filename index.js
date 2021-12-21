const skjema = document.querySelector("#skjema");
const dato = document.querySelector("#dato");
const fornamn = document.querySelector("#fornamn");
const etternamn = document.querySelector("#etternamn");
const telefon = document.querySelector("#telefon");
const email = document.querySelector("#email");
const oppdragInfo = document.querySelector("#oppdragInfo");
const inpBilde = document.querySelector("#inpBilde");
const overlay = document.querySelector("#overlay");
//referere til id html. const istadan for var/let fordi dei skal ikkje endrast
//querySelector lar deg referere fleire typer element som id, class, tagger

const main = document.querySelector("main"); //referere til <main>

//firebase
const db = firebase.database();
const storage = firebase.storage();
	
const itOppdrag = db.ref("itOppdrag");

//funksjon som lagrer bilete i databasen
function lagreOppdrag(evt){
    evt.preventDefault(); //hindrar at blir sent tilny side

    overlay.style.display = "flex"; //viser overlay

    const bilde = inpBilde.files[0]; //bilete som skal lastast opp

    const lagringsplass = storage.ref("oppdrag/" + ( +new Date() ) + bilde.name); //kvar bilete vert lagra

	//laster bilete til skjema
    lagringsplass.put(bilde)
	    .then( bilde => bilde.ref.getDownloadURL() )
	    .then( url => {
	    //putte url, dato, namn, tlf, email, og beskrivelse i databasen. slutten av at array. url linker til bilete lagra i storage
        itOppdrag.push({
	    url: url,
        date: dato.value,
	fornamn: fornamn.value,
        etternamn: etternamn.value,
        telefon: telefon.value,
        email: email.value,
        tekst: oppdragInfo.value
	    });
	    skjema.reset(); //nulstiller skjema
	    overlay.style.display = "none";
	    } );
	
	}
	
	function visBilde(snap) {
	    const key = snap.key;
	    const data = snap.val();
	
	//setter inn artikkel med data, namn, tlf, email, beskrivelse, og bilete inn i <main>
	    main.innerHTML = `
	    <article>
		<p>${data.date}</p>
        <p>${data.fornamn} ${data.etternamn}</p>
        <p>${data.telefon}</p>
        <p>${data.email}</p>
	    <p>${data.tekst}</p>
        <img src="${data.url}">
	    </article>
	    ` + main.innerHTML;
	}
	
	
	// Event Listeners
	skjema.addEventListener("submit", lagreOppdrag);
	itOppdrag.on("child_added", visBilde);
