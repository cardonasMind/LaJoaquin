import React, { useRef, useEffect } from "react";

import { useRouter } from "next/router";

import Link from "next/link";

const Navigation = () => {
  const router = useRouter()
  const actualURL = router.pathname;

  const filledIcons = {
    filledInicio:
      '<path d="M946.5 505L534.6 93.4a31.93 31.93 0 00-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-.1-90.5z" />',
    filledProfes:
      '<path d="M348 676.1C250 619.4 184 513.4 184 392c0-181.1 146.9-328 328-328s328 146.9 328 328c0 121.4-66 227.4-164 284.1V792c0 17.7-14.3 32-32 32H380c-17.7 0-32-14.3-32-32V676.1zM392 888h240c4.4 0 8 3.6 8 8v32c0 17.7-14.3 32-32 32H416c-17.7 0-32-14.3-32-32v-32c0-4.4 3.6-8 8-8z"></path>',
    filledMiembro:
      '<path d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3A255.2 255.2 0 00324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32zM404 553.5c0 4.1-3.2 7.5-7.1 7.5H211.1c-3.9 0-7.1-3.4-7.1-7.5v-45c0-4.1 3.2-7.5 7.1-7.5h185.7c3.9 0 7.1 3.4 7.1 7.5v45zm0-140c0 4.1-3.2 7.5-7.1 7.5H211.1c-3.9 0-7.1-3.4-7.1-7.5v-45c0-4.1 3.2-7.5 7.1-7.5h185.7c3.9 0 7.1 3.4 7.1 7.5v45zm416 140c0 4.1-3.2 7.5-7.1 7.5H627.1c-3.9 0-7.1-3.4-7.1-7.5v-45c0-4.1 3.2-7.5 7.1-7.5h185.7c3.9 0 7.1 3.4 7.1 7.5v45zm0-140c0 4.1-3.2 7.5-7.1 7.5H627.1c-3.9 0-7.1-3.4-7.1-7.5v-45c0-4.1 3.2-7.5 7.1-7.5h185.7c3.9 0 7.1 3.4 7.1 7.5v45z"></path>'
  };

  const inicioIcon = useRef();
  const clubsButton = useRef();
  const profesIcon = useRef();
  const miembroIcon = useRef();

  useEffect(() => {
    const navigationIcons = {
      inicio: inicioIcon.current,
      clubs: clubsButton.current,
      profes: profesIcon.current,
      miembro: miembroIcon.current
    }

    if(actualURL === "/") {
      navigationIcons.inicio.innerHTML = filledIcons.filledInicio;
    } else if(actualURL === "/clubs") {
      navigationIcons.clubs.style.background = "var(--yellow)";
    } else if(actualURL === "/profes") {
      navigationIcons.profes.innerHTML = filledIcons.filledProfes;
    } else if(actualURL === "/miembro") {
      navigationIcons.miembro.innerHTML = filledIcons.filledMiembro;
    }
  })
  
  return(
    <div id="navigation">
      <Link href="/">
        <a id="go-inicio">
          <svg
            ref={inicioIcon}
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="home"
            width="1.4rem"
            height="1.4rem"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 00-44.4 0L77.5 505a63.9 63.9 0 00-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0018.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
          </svg>
          Inicio
        </a>
      </Link>

      <Link href="/clubs">
        <a id="go-clubs" ref={clubsButton}>
          <svg 
            focusable="false"
            height="1.6rem" 
            viewBox="0 0 512 512" 
            width="1.6rem"
            aria-hidden="true"
          >
            <g><path d="m391.801 116.225c34.669 71.715 2.368 157.443-70.017 188.791h-49.324c32.477-25.527 43.346-65.184 43.346-109.709 0-21.803 4.99-42.461-3.936-60.842 24.238-13.938 52.164-20.27 79.931-18.24z" fill="#76d081"/><path d="m239.543 305.016h-49.323c-72.215-31.252-104.757-116.848-70.034-188.791 27.784-2.029 55.71 4.303 79.948 18.24-8.944 18.381-3.954 39.039-3.954 60.842 0 44.525 10.886 84.181 43.363 109.709z" fill="#ade993"/><path d="m239.543 305.016c-77.988-61.299-68.754-181.365 16.459-230.547 24.115 13.918 33.661 34.84 45.868 59.996 8.926 18.381 13.936 39.039 13.936 60.842 0 44.525-10.869 84.182-43.346 109.709-.1 0-.964 0-.864 0-8.64 0-24.755 0-32.053 0z" fill="#f0ce46"/><path d="m272.46 305.016c77.827-61.172 68.868-181.297-16.458-230.547-.001 0-.001 0-.002.002v230.545z" fill="#e8a43e"/><path d="m403 222.531c-65.041 0-121.242 28.297-147 83.387-25.758-55.09-81.959-93.387-147-93.387h-109v64c0 88.775 72.673 161 162 161h93.413c2.594 0 89.685-10 94.587-10 89.327 0 152-62.225 152-151v-54z" fill="#e17d46"/><path d="m350 437.531c89.327 0 162-72.225 162-161v-64h-109c-65.041 0-121.242 38.297-147 93.387v131.613z" fill="#db4d6c"/><path d="m211.435 376.531h-49.435c-50.062 0-93.056-36.926-100.007-85.891l-2.429-17.109h49.436c50.062 0 93.056 36.926 100.007 85.892z" fill="#ecf4f9"/><path d="m350 376.531h-49.435l2.428-17.108c6.95-48.967 49.943-85.892 100.006-85.892h49.435l-2.428 17.107c-6.95 48.967-49.943 85.893-100.006 85.893z" fill="#cddff8"/></g>
          </svg>
          Clubs
        </a>
      </Link>

      <Link href="/profes">
        <a id="go-profes">
          <svg 
            ref={profesIcon}
            viewBox="64 64 896 896" 
            focusable="false" 
            data-icon="bulb" 
            width="1.4rem" 
            height="1.4em" 
            fill="currentColor" 
            aria-hidden="true"
          >
            <path d="M632 888H392c-4.4 0-8 3.6-8 8v32c0 17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-32c0-4.4-3.6-8-8-8zM512 64c-181.1 0-328 146.9-328 328 0 121.4 66 227.4 164 284.1V792c0 17.7 14.3 32 32 32h264c17.7 0 32-14.3 32-32V676.1c98-56.7 164-162.7 164-284.1 0-181.1-146.9-328-328-328zm127.9 549.8L604 634.6V752H420V634.6l-35.9-20.8C305.4 568.3 256 484.5 256 392c0-141.4 114.6-256 256-256s256 114.6 256 256c0 92.5-49.4 176.3-128.1 221.8z"></path>
          </svg>
          Profes
        </a>
      </Link>

      <Link href="/miembro">
        <a id="go-miembro">
          <svg 
            ref={miembroIcon}
            viewBox="64 64 896 896" 
            focusable="false"
            data-icon="read" width="1.4rem" 
            height="1.4em" 
            fill="currentColor" 
            aria-hidden="true"
          >
            <path d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3A255.2 255.2 0 00324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32zM324.8 721H136V233h188.8c35.4 0 69.8 10.1 99.5 29.2l48.8 31.3 6.9 4.5v462c-47.6-25.6-100.8-39-155.2-39zm563.2 0H699.2c-54.4 0-107.6 13.4-155.2 39V298l6.9-4.5 48.8-31.3c29.7-19.1 64.1-29.2 99.5-29.2H888v488zM396.9 361H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm223.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0-4.1-3.2-7.5-7.1-7.5H627.1c-3.9 0-7.1 3.4-7.1 7.5zM396.9 501H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm416 0H627.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5z"></path>
          </svg>
          Tú
        </a>
      </Link>

      <style jsx>{`
        #navigation {
          background: white;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          text-align: center;
          position: fixed;
          right: 0;
          bottom: 0;
          left: 0;
        }

        #navigation svg {
          margin: auto;
        }

        #navigation #go-inicio,
        #navigation #go-clubs,
        #navigation #go-profes,
        #navigation #go-miembro {
          padding: .6rem;
          display: grid;
          color: #121212;
          text-decoration: none;
        }
      `}</style>
    </div>
  )
}

export default Navigation;