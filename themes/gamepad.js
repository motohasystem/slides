(() => {
    document.addEventListener("DOMContentLoaded", (event) => {
        window.addEventListener("gamepadconnected", (e) => {
            console.log("Gamepad connected:", e.gamepad);
            requestAnimationFrame(updateGamepadStatus);
        });
        let global_whiteouted = false;
        let global_last_cursor = null;
        let global_last_button = null;
        function updateGamepadStatus() {
            const gamepads = navigator.getGamepads();

            for (let i = 0; i < gamepads.length; i++) {
                const gp = gamepads[i];
                if (gp) {
                    const sticks = gp.axes;
                    let x_newtral = false;
                    let y_newtral = false;
                    sticks.forEach((stick, index) => {
                        // console.log({ stick, index });
                        if (index == 0) {
                            if (stick > 0.5) {
                                simulateCursorKeyPress("ArrowRight");
                                x_newtral = false;
                            } else if (stick < -0.5) {
                                simulateCursorKeyPress("ArrowLeft");
                                x_newtral = false;
                            } else {
                                x_newtral = true;
                            }
                        } else if (index == 1) {
                            if (stick > 0.5) {
                                simulateCursorKeyPress("ArrowDown");
                                y_newtral = false;
                            } else if (stick < -0.5) {
                                simulateCursorKeyPress("ArrowUp");
                                y_newtral = false;
                            } else {
                                y_newtral = true;
                            }
                        } else if (x_newtral && y_newtral) {
                            simulateCursorKeyPress("ArrowNewtral");
                        }
                    });

                    // console.log(gp.buttons);
                    let count_pressed_button = 0;
                    gp.buttons.forEach((button, index) => {
                        if (button.pressed) {
                            switch (index) {
                                case 0: // A
                                    simulateButtonPress("a");
                                    break;
                                case 1: // B
                                    simulateButtonPress("b");
                                    break;
                                case 7: // C
                                    simulateButtonPress("c");
                                    break;
                                case 2: // X
                                    simulateButtonPress("x");
                                    break;
                                case 3: // Y
                                    simulateButtonPress("y");
                                    break;
                                case 5: // Z
                                    simulateButtonPress("z");
                                    break;
                            }
                            count_pressed_button++;
                            // } else {
                            //     console.log({ index });
                        }
                    });

                    // ボタンが何も押されていなければニュートラルボタンを押す
                    if (count_pressed_button == 0) {
                        simulateButtonPress("buttonNewtral");
                    }
                }
            }
            requestAnimationFrame(updateGamepadStatus);
        }

        // カーソルキーを受け取る
        function simulateCursorKeyPress(key) {
            if (global_last_cursor === key) {
                return;
            }

            console.log({ key });
            const event = new KeyboardEvent("keydown", { key: key });
            document.dispatchEvent(event);
            global_last_cursor = key;
        }

        // ボタン操作を受け取る
        function simulateButtonPress(key) {
            if (global_last_button === key) {
                return;
            }

            console.log({ key });
            const event = new KeyboardEvent("keydown", { key: key });
            document.dispatchEvent(event);
            global_last_button = key;

            if (key === "z") {
                whiteout();
            } else if (key === "y") {
                blackout();
            }
        }

        function whiteout() {
            createWipeout("#FFF");
        }

        function blackout() {
            createWipeout("#000");
        }

        // 画面全体を非表示にして真っ黒にする。window.global_whiteouted を利用してもう一度呼び出されるともとに戻す。
        function createWipeout(color = "#FFF") {
            const node = document.getElementById("wipeout");
            if (node !== null) {
                node.remove();
                return;
            }
            const whiteout = document.createElement("div");
            whiteout.id = "wipeout";
            whiteout.style.position = "fixed";
            whiteout.style.top = "0";
            whiteout.style.left = "0";
            whiteout.style.width = "100%";
            whiteout.style.height = "100%";
            whiteout.style.backgroundColor = color;
            whiteout.style.zIndex = "10000";
            document.body.appendChild(whiteout);
        }
    });
})();
