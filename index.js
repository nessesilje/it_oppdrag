const skjema = document.querySelector("#skjema");
const dato = document.querySelector("#dato");
const fornamn = document.querySelector("#fornamn");
const etternamn = document.querySelector("#etternamn");
const telefon = document.querySelector("#telefon");
const email = document.querySelector("#email");
const oppdragInfo = document.querySelector("#oppdragInfo");
const inpBilde = document.querySelector("#inpBilde");
const overlay = document.querySelector("#overlay");

const main = document.querySelector("main");

const db = firebase.database();
const storage = firebase.storage();
	
const itOppdrag = db.ref("itOppdrag");

function lagreOppdrag(evt){
    evt.preventDefault();

    overlay.style.display = "flex";

    const bilde = inpBilde.files[0];

    const lagringsplass = storage.ref("oppdrag/" + ( +new Date() ) + bilde.name);

    lagringsplass.put(bilde)
	    .then( bilde => bilde.ref.getDownloadURL() )
	    .then( url => {
        itOppdrag.push({
	    url: url,
        date: dato.value,
	    fornamn: fornamn.value,
        etternamn: etternamn.value,
        telefon: telefon.value,
        email: email.value,
        tekst: oppdragInfo.value
	    });
	    skjema.reset();
	    overlay.style.display = "none";
	    } );
	
	}
	
	function visBilde(snap) {
	    const key = snap.key;
	    const data = snap.val();
	
	    main.innerHTML = `
	    <article>
        <p>${data.date}</p>
        <p>${data.fornamn}</p>
        <p>${data.etternamn}</p>
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