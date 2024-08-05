// FIT2102 2019 Assignment 1
// https://docs.google.com/document/d/1Gr-M6LTU-tfm4yabqZWJYg-zTjEVqHKKTCvePGCYsUA/edit?usp=sharing

//Name: Mohammed Sharief Sayed Mohammed 
//Student ID: 29630126 

/*
* DESIGN IMPLEMNENTATION: 
* First the ship is created and enabled to move with ability for the user to generate bullets from the ship by mouse clicks  
*, then asteriods are generated every 5 seconds at at random locations 
* along the edge of the canvas. As the bullet hit the asteriod only smaller asteriods get destroyed while bigger steriods split into two smaller asteriods(additional feature). 
* In case the ship collides with the asteriod the game ends. 
*
*The code is reusable since a functional implementation is used to generate the asteriods instead of calling it multiple times.  
*The functions are pure as they do not have any side effects and do not effect any variables that are outside the scope. 
*/


/*
* This function generates asteriods from the position given to the function and moves them around the rectangle, also 
* the function checks if any of the asteriods collide with the ship and end the game in that case. 
*[Parameters] 
* Size1 -> size of the radius of the asteriod  
* ast -> the type of element of the asteriod 
* x -> x coordinate of the start location 
* y -> y coordinate of the start location 
* g -> the type of element of the ship 
* aList -> the list which contains all of the asteriods  
*/
function generateAsteriods(size1: number,ast: Elem, x: string, y: string,g: Elem, aList: Array<Elem>){
  //This function is created in order to prevent duplication of code as it is being called multiple of times 
  const svg = document.getElementById("canvas")!; 
  //a matrix creating function that generates a matrix of the transformations of a given element 
  const transformMatrix = (e:Elem) => new WebKitCSSMatrix(window.getComputedStyle(e.elem).webkitTransform)
  //It creates a variable from the instance of the asteriiod with the given attributes 
  let asteroid1 = new Elem(svg, 'circle', ast.elem)
      .attr("r", String(size1))
      .attr("fill","red") 
      .attr('visibility','visible')
      .attr("cx",x)
      .attr("cy",y)
  //adding the asteriods created to the aList 
  aList.push(asteroid1) 
 
  // r1 and r2 generates the random number for x and y implementations in order to move the asteriods 
  const r1 = 
  Math.floor(Math.random() * (+20 - -20)) + -20; 
  const r2 = 
  Math.floor(Math.random() * (+20 - -20)) + -20; 
  //Creates an observable at an interval 100 milliseconds and subscribes to make the asteriod move 
  //The reason obesrrvables interval are being used to ensure that it shifts the asteriod at every interval and to make the code functional  
  Observable.interval(100)
    .subscribe(()=>{ 
    //The unary conditions take care of the wrapping in both x and y directions and unary conditions are used in this case as they are more fumctional 
    //The first unary condition wrapps when exceeding the left bound   
      (Number(asteroid1.attr('cx'))<0)?
    asteroid1
    .attr('cx',String(600))
    .attr('cy',String(r2+Number(asteroid1.attr('cy')))): asteroid1; 
     //The second unary condition wrapps when exceeding the right bound   
      (Number(asteroid1.attr('cx'))>600)?
    asteroid1
    .attr('cx',String(0))
    .attr('cy',String(r2+Number(asteroid1.attr('cy')))):asteroid1;
     //The third unary condition wrapps when exceeding the lower bound    
     (Number(asteroid1.attr('cy'))>600)?
    asteroid1
    .attr('cx',String(r1+Number(asteroid1.attr('cx'))))
    .attr('cy',String(0)): asteroid1; 
     //The fourth unary condition wrapps when exceeding the upper bound     
      (Number(asteroid1.attr('cy'))<0)?
    asteroid1
    .attr('cx',String(r1+Number(asteroid1.attr('cx'))))
    .attr('cy',String(600)): asteroid1;
      
    //shifts the asteriod by r1 and r2 which are the x and y generated values 
    asteroid1 
    .attr('cx',String(r1+Number(asteroid1.attr('cx'))))
    .attr('cy',String(r2+Number(asteroid1.attr('cy'))))
    
    //The constants are used to calaculate the euclidean distance between the center of the asteriod and the ship  
    const difference_in_y = transformMatrix(g).m42- Number(asteroid1.attr("cy")); 
    const difference_in_x = transformMatrix(g).m41 - Number(asteroid1.attr("cx")); 
    const distance = Math.sqrt((difference_in_y * difference_in_y) + (difference_in_x * difference_in_x));  
    //The euclidean distance is used to check if the asteriod is hitting the ship 
    if (distance <=   Number(asteroid1.attr("r")) && asteroid1.attr("visibility") != "hidden"){  
      //creating a black rectangle to end the game
      let rec2 = new Elem(svg,"rect")  
      .attr("width","4000")
      .attr("height","4000") 
      .attr("x",0)
      .attr("y",0)
      .attr("fill","white")
      //printing game over on the rectangle    
      let endgame = new Elem(svg ,"text")
      .attr('x',300)
      .attr('y',300)
      .attr('fill','red')
      .attr('font-size',50)
      endgame.elem.textContent = "Game Over" 
  }

});
}




function asteroids() { 
  // Inside this function you will use the classes and functions 
  // defined in svgelement.ts and observable.ts
  // to add visuals to the svg element in asteroids.html, animate them, and make them interactive.
  // Study and complete the Observable tasks in the week 4 tutorial worksheet first to get ideas.

  // You will be marked on your functional programming style
  // as well as the functionality that you implement.
  // Document your code!  
  // Explain which ideas you have used ideas from the lectures to 
  // create reusable, generic functions.
  const svg = document.getElementById("canvas")!;

  let rec = new Elem(svg,"rect")  
  .attr("width","1000")
  .attr("height","1000") 
  .attr("x",0)
  .attr("y",0) 
  .attr("fill","black") 

  var astlist = new Array; 
  // make a group for the spaceship and a transform to move it and rotate it    
  // to animate the spaceship you will update the transform property
  let g = new Elem(svg,'g')
    .attr("transform","translate(300 300) rotate(170)")    
  

  // create a polygon shape for the space ship as a child of the transform group
  let ship = new Elem(svg, 'polygon', g.elem) 
    .attr("points","-15,20 15,20 0,-20")
    .attr("style","fill:lime;stroke:purple;stroke-width:1")
    .attr("pointX","300") 
    .attr("pointY","320")  
 
 //a matrix creating function that generates a matrix of the transformations of a given element 
 const transformMatrix = 
    (e:Elem) => new WebKitCSSMatrix(window.getComputedStyle(e.elem).webkitTransform)
//Creates an observable event for the mouse movement and the reason for this implementation is that its a functional way of calling the subscribe code each time the mouse move 
  const 
    mousemove = Observable.fromEvent<MouseEvent>(svg, 'mousemove');
    //Observes a rectangle for a mouse move event 
    rec.observe<MouseEvent>('mousemove')   
    //flatmaps to observe the mouse movements  
    .flatMap(({}) =>   
      mousemove
      //maps using clientX and clientY which are the x and y positions of the mouse to get clientX, clientY, x, y where x and y are the center positions of the ship in 
      //the respective direction 
      .map(({clientX, clientY}) => ({ clientX:clientX,clientY:clientY,x:transformMatrix(g).m41,y:transformMatrix(g).m42}))) 
      //subscribes to transform the ship at each iteration by using the values x,y, clientX, clientY  
      .subscribe(({clientX,clientY,x,y}) =>{
        g.attr("transform", "translate("+String(x+((-x+clientX)/1000))+","+String(y+((-y+clientY)/1000))+") rotate("+String(Math.atan2(clientX-x,y-clientY)* 180 / Math.PI)+")")
        
    });   

  
  //creates a type of element which is used to make the asteriod 
  let ast = new Elem(svg,'g')
  
 //Creates an observable which iterates every 5 seconds in order to generate the asteriods and the reason for using an observable is to allow more functional implementation 
  Observable.interval(5000) 
  .subscribe(()=>{
    //n1 generates a value between zero and 1 to decide which edge the asteriod appears from 
    const n1 = Math.random(), 
    //n2 generates a value between 0 and 600 to decide where in the selected edge the asteriod appears from 
    n2 = Math.floor(Math.random() * (+600 - -0)) + -0; 

    //size 1 generates a number between 10 and 50 to decide the size of the asteriod to be generated 
    var size1= Math.floor(Math.random() * (+50 - +10)) + +10; 
    //The unary conditions are nested and calls the function for generating the asteriod function with differing x and y values which are based on the conditions 
    n1 <= 0.25 ? generateAsteriods(size1,ast,String(0),String(n2),g,astlist): 
    (n1 <= 0.5 ? generateAsteriods(size1,ast,String(600),String(n2),g,astlist):
    (n1 <= 0.75 ? generateAsteriods(size1,ast,String(n2),String(0),g,astlist):
    (generateAsteriods(size1,ast,String(n2),String(600),g,astlist) ))) 
 
}); 
  //cretes the observable for both the mouseup and mousedown from the respective events 
  const mouseup = Observable.fromEvent<MouseEvent>(svg, 'mouseup'),
  mousedown = Observable.fromEvent<MouseEvent>(svg, 'mousedown')

  //observe a rectangle for the mouse down event in order to implement the shooting in a functional manner 
  rec.observe<MouseEvent>('mousedown')   

  //flatmaps to observe the mousedown event   
  .flatMap(({}) => 
    mousedown
    //take mousedown untill the mouse is released using the mouseup event 
     .takeUntil(mouseup) 
     //maps using clientX and clientY which are the x and y positions of the mouse to get  x, y where x and y are the transformations by which the bullet moves in 
      //the respective direction 
      .map(({clientX, clientY}) => ({ x:(-transformMatrix(g).m41+clientX)/10,y:(-transformMatrix(g).m42+clientY)/10}))) 
      //subscribes to create a bullet and make it move 
      .subscribe(({x, y}) =>{
    //Creates the bullets the position of the ship 
    let bullets = new Elem(svg, 'circle') 
    .attr("cx", String(transformMatrix(g).m41) ) 
    .attr("cy", String(transformMatrix(g).m42) )
    .attr("r", "4")
    .attr("fill","purple") 
  
  //cretes the observable which iterates every 10 milliseconds 
  Observable.interval(10) 
  //ends the iteration at 10 seconds 
  .takeUntil(Observable.interval(10000))
  //subscribes to transform the bullet at every iteration by x and y 
  .subscribe(()=>{
    bullets.attr("transform","translate("+String(x)+" "+String(y)+")")
      .attr('cx',String(x+Number(bullets.attr("cx"))))
      .attr('cy',String(y+Number(bullets.attr("cy")))); 
  //if the bullet goes out of bounds it is removed from the document 
   (Number(bullets.attr('cx'))<0||Number(bullets.attr('cx'))>600||Number(bullets.attr('cy'))<0||Number(bullets.attr('cy'))>600)?
    bullets.elem.remove(): null 
  
          
  //Creates an observable from the array aList which subscribes to check if each of the asteriods in aList are hit by the bullet 
  Observable.fromArray(astlist).subscribe((asteroid)=>{
    //The constants are used to calaculate the euclidean distance between the center of the asteriod and the bullet   
    const difference_in_y = Number(bullets.attr("cy")) - Number(asteroid.attr("cy")); 
    const difference_in_x = Number(bullets.attr("cx")) - Number(asteroid.attr("cx")); 
    const distance = Math.sqrt((difference_in_y * difference_in_y) + (difference_in_x * difference_in_x)); 
    //generates a value for the size of the asteriod  
    var size1= Math.floor(Math.random() * (+30 - +10)) + +10; 
    //checks if the asteriod hit the bullet using the euclidean distance 
    (distance <=  Number(bullets.attr("r")) + Number(asteroid.attr("r")))?(
      astlist.splice(astlist.indexOf(asteroid), 1),(  
      //check if the size of the asteriod is larger than 30 
      (Number(asteroid.attr("r"))>30)?(
       
  //generate asteriods by calling the function generateAsteriods twice to create 2 smaller asteriods 
  generateAsteriods(size1,ast,asteroid.attr("cx"),asteroid.attr("cy"),g,astlist), 
  generateAsteriods(size1,ast,asteroid.attr("cx"),asteroid.attr("cy"),g,astlist)): null ), 

    
    //remove the bullet and the asteriod from the document 
    asteroid.attr("visibility", "hidden"),

    asteroid.elem.remove(),
    bullets.elem.remove()): null  


 
}); 
}); 
}); 

}   

// the following simply runs your asteroids function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = ()=>{
    asteroids();
    
  }

 

 
 


























