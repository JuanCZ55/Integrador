
        const imagenes = [];
        for (let i = 1; i <= 5; i++) {
            imagenes.push("../Imagenes/GTA5/Imagen (" + i + ").jpg");
        }

        const imgOne = document.getElementById("gtaV-imagen-1");
        const imgTwo = document.getElementById("gtaV-imagen-2");
        const imgTree = document.getElementById("gtaV-imagen-3");
        const botonDe = document.getElementById("gtaV-button-derecho");
        const botonIz = document.getElementById("gtaV-button-izquierdo");

        var contI = 0;
        var contIm = 1;
        var contImg = 2;

        function cambiarImg(){
            imgOne.src = imagenes[contI];
            imgTwo.src = imagenes[contIm];
            imgTree.src = imagenes[contImg];
        }

        botonDe.addEventListener("click", ()=>{
            if(contImg == 0){
                contImg=3;
            }else{
                contImg=contImg-1;
            }
            if(contIm == 0){
                contIm=3;
            }else{
                contIm--;
            }
            if(contI == 0){
                contI=3;
            }else{
                contI--;
            }
            cambiarImg();
        })
        botonIz.addEventListener("click", ()=>{
            if(contImg == 3){
                contImg=0;
            }else{
                contImg++;
            }
            if(contIm == 3){
                contIm=0;
            }else{
                contIm++;
            }
            if(contI == 3){
                contI=0;
            }else{
                contI++;
            }
            cambiarImg();
        })
