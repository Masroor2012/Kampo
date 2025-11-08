setTimeout(() => {
            let anim = document.getElementById('load-anim')
            anim.style.display = 'none'
}, 2500)

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');



form.addEventListener('submit', (event) => {
    event.preventDefault();
    let user = document.getElementById('val1')
    let email = document.getElementById('val2').value
    let password = document.getElementById('val3').value
    let error = document.getElementById('erroutput')
    let userPassword = localStorage.getItem('email')

                   

    // RECOGNIZATION FUNCTION

    if(password == userPassword){
        // Authenticate user ID loading animation

        document.getElementById('auth-user-id-load-cont').style.display = 'flex';
        
        let percent = 0;
        const text = document.getElementById("percentage");
        const status = document.getElementById("status");

        document.getElementById('overall-cont').style.display = 'none';

        const statusMessages = {
            20: "Authenticating user ID...",
            60: "Checking password...",
            90: "Re-cheking..."
        };

        const interval = setInterval(() => {
            if (percent <= 100) {
            text.textContent = percent + "%";

            // Update status message if one is defined for the current percent
            if (statusMessages[percent]) {
                status.textContent = statusMessages[percent];
            }

            percent += 5;
            } else {
            status.textContent = "Recognized!";
            clearInterval(interval);
            }
        }, 1000);

        localStorage.setItem('name', `${user.value}`)


        setTimeout(() => {
            document.getElementById('bar-cont').style.display = 'none'
            document.getElementById('hidden-btn').style.display = 'block'
        }, 24500)
    }else{
        document.getElementById('auth-user-id-load-cont2').style.display = 'flex';
        let percent2 = 0;
        const text2 = document.getElementById("percentage2");
        const status2 = document.getElementById("status2");

        document.getElementById('overall-cont').style.display = 'none';

        const statusMessages2 = {
            20: "Authenticating user ID...",
            60: "Checking password...",
            90: "Re-cheking..."
        };

        const interval = setInterval(() => {
            if (percent2 <= 100) {
            text2.textContent = percent2 + "%";

            // Update status message if one is defined for the current percent
            if (statusMessages2[percent2]) {
                status2.textContent = statusMessages2[percent2];
            }

            percent2 += 5;
            } else {
            status2.textContent = "Incorrect Password!";
            clearInterval(interval);
            }
        }, 1000);


        setTimeout(() => {
            document.getElementById('bar-cont').style.display = 'none'
            document.getElementById('auth-user-id-load-cont2').style.display = 'none'
            document.getElementById('overall-cont').style.display = 'block'
            
            
        }, 24500)
    }

    email = ''
    password = ''
})
