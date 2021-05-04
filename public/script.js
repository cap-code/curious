let auto = document.getElementById("auto");
let light = document.getElementById("light");
let dark = document.getElementById("dark");
const switchMode = (event) => {
    switch (event.target.value) {
        case "auto":
            auto.classList.remove("hidden");
            light.classList.add("hidden");
            dark.classList.add("hidden");
            break;
        case "light":
            auto.classList.add("hidden");
            light.classList.remove("hidden");
            dark.classList.add("hidden");
            break;
        case "dark":
            auto.classList.add("hidden");
            light.classList.add("hidden");
            dark.classList.remove("hidden");
            break;
        default:
            break;
    }
};
