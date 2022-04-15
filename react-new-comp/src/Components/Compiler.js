import React, { useState } from 'react'
import './Compiler.css';
// import Button from '@mui/material/Button';
// import DarkModeIcon from '@mui/icons-material/DarkMode';
// import { modalClasses } from '@mui/material';


function Compiler() {

    const [lang, setLang] = useState('');
    const [input, setInput] = useState(localStorage.getItem('input') || '');
    const [output, setOutput] = useState('');
    // const [userInput,setUserInput] = useState('');
    const handleLang = (lang) => {
        setLang(lang);
        //54 C++
        //50 C
        //62 Java
        //71 Python
        localStorage.setItem('language_Id', lang)
    }

    const getLangCode = (val) =>{
        if(val === 'c')
            return 50;
        // else if(val === 'cpp')
        //     return 54;
        else if(val === 'java')
            return 62;
    }

    const submit = async (e) => {
        const apiKey = "587fe35072msh5159abc0acc765ap1d8ed2jsn94d69b019fd6";
        e.preventDefault();
        let outputText = document.getElementById("output");
        outputText.innerHTML = "";
        outputText.innerHTML += "Creating Submission ...\n";
        const response = await fetch(
            "https://judge0-ce.p.rapidapi.com/submissions",
            {
                method: "POST",
                headers: {
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                    "x-rapidapi-key": apiKey, // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
                    "content-type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify({
                    source_code: input,
                    stdin: '',
                    language_id: getLangCode(lang),
                }),
            }
        );

        outputText.innerHTML += "Submission Created ...\n";
        const jsonResponse = await response.json();
        console.log('<--jsonResponse-->', jsonResponse)
        let jsonGetSolution = {
            status: { description: "Queue" },
            stderr: null,
            compile_output: null,
        };
        while (
            jsonGetSolution.status.description !== "Accepted" &&
            jsonGetSolution.stderr == null &&
            jsonGetSolution.compile_output == null
        ) {
            outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
            if (jsonResponse.token) {
                let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;
                const getSolution = await fetch(url, {
                    method: "GET",
                    headers: {
                        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                        "x-rapidapi-key": apiKey, // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
                        "content-type": "application/json",
                    },
                });
                jsonGetSolution = await getSolution.json();
            }
        }

        if (jsonGetSolution.stdout) {
            const output = atob(jsonGetSolution.stdout);
            outputText.innerHTML = "";
            outputText.innerHTML += `Results :\n${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`;
        } else if (jsonGetSolution.stderr) {
            const error = atob(jsonGetSolution.stderr);
            outputText.innerHTML = "";
            outputText.innerHTML += `\n Error :${error}`;
        } else {
            const compilation_error = atob(jsonGetSolution.compile_output);
            outputText.innerHTML = "";
            outputText.innerHTML += `\n Error :${compilation_error}`;
        }
    }

    const handleInput = (event) => {
        event.preventDefault();
        setInput(event.target.value)
        localStorage.setItem('input', event.target.value)
    };
    return (

        <div>
            <div className='navBar'>
                <p className='main-heading'>Sufyan</p>
                <p className='second-heading'>Online Compiler</p>
            </div>

            <div className='main-container'>
                <div className='Language'>
                    <div  className={lang === 'c' ? 'clogo logo-selected' : 'clogo'}>
                        <img  width="50px" height="50px" src='./images/clang.png' alt=""
                            onClick={() => handleLang("c")} />
                    </div>
                    {/* <img  src='./images/clang.jpg' alt=""
                        onClick={() => handleLang("c")} /> */}
                    {/* <img src='./images/c++.png' alt=""
                        className={lang === 'cpp' ? 'cpplogo logo-selected' : 'cpplogo'}
                        onClick={() => handleLang("cpp")} /> */}
                    <img src='./images/java.png' alt=""
                        className={lang === 'java' ? 'javalogo logo-selected' : 'javalogo'}
                        onClick={() => handleLang("java")} />
                    {/* <img src='./images/csharp.PNG' alt=""
                        className={lang === 'csharp' ? 'plogo logo-selected' : 'plogo'}
                        onClick={() => handleLang("csharp")} /> */}
                </div>

                <div className='editor-area'>
                    <div className='left-panel'>
                        <textarea
                            onChange={handleInput}
                            className=" source"
                            value={input}>
                        </textarea>
                    </div>

                    <div id="output" className='right-panel'>
                        <h2>Output</h2>
                    </div>
                </div>



                <div className='bottom-area'>
                    <div className='run-btn'>
                        {/* <Button onClick={submit} variant="contained">Run</Button> */}
                        <button onClick={submit} className="submit-btn">Run</button>
                    </div>
                    {/* <div className='second-panel'>Output</div> */}
                </div>
            </div>
        </div>
    )
}

export default Compiler;