function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No file provided");
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

class GenerativeArt {
  constructor() {
    this.uploadButton = document.getElementById("uploadButton");
    this.generatedScript = document.getElementById("generatedScript");
    this.textEditorDiv = document.querySelector(".text-editor");
    this.fileInput = document.getElementById("imageInput");
    this.loader = document.getElementById("loader");
  }
  init() {
    this.uploadButton.addEventListener("click", async (e) => {
      if (this.generatedScript) {
        this.cleanScript();
      }

      let base64Image;

      try {
        const file = this.fileInput.files[0];

        base64Image = await readFileAsBase64(file);
      } catch (e) {
        console.error("cannot convert the image file to base64");
      }

      try {
        if (!base64Image) {
          throw new Error("no image");
        }

        this.addLoader();

        const result = await this.handleSubmit(base64Image);

        if (!result.response) {
          this.removeLoader();
          return;
        }

        const codeSnippetRegex = /```(?:javascript)?\n([\s\S]*?)```/;

        const match = result.response.match(codeSnippetRegex);

        let codeSnippet;

        if (match) {
          this.removeLoader();

          codeSnippet = match[1];

          console.log("codeSnippet", codeSnippet);

          this.textEditorDiv.innerHTML = `<pre><code>${codeSnippet}</code></pre>`;
          this.createScript(codeSnippet);
        } else {
          console.log("No code snippet found.");
        }
      } catch (e) {}
    });
  }

  cleanScript() {
    const canvas = document.querySelector("#defaultCanvas0");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    this.textEditorDiv.innerHTML = "";
    this.generatedScript.textContent += "clear()";
    this.generatedScript.remove();
  }

  createScript(generatedCode) {
    const callFnCode = `setup();`;

    if (this.generatedScript) {
      this.generatedScript.textContent = "";
    } else {
      this.generatedScript = document.createElement("script");
      this.generatedScript.setAttribute("id", "generatedScript");
    }

    const completeCode = (generatedCode += callFnCode);

    this.generatedScript.textContent = completeCode;

    document.body.appendChild(this.generatedScript);
  }

  async handleSubmit(base64Image) {
    try {
      let response = await fetch("api/gpt4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      });

      let data = await response.json();

      return data;
    } catch (e) {}
  }

  addLoader() {
    document.body.classList.add("loading");
    this.loader.classList.add("visible");
  }

  removeLoader() {
    document.body.classList.remove("loading");
    this.loader.classList.remove("visible");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const GenerateAI = new GenerativeArt();
  GenerateAI.init();
});
