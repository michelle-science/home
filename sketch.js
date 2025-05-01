let particles = [];
let smoke = [];
let lavaFlows = [];

function setup() {
  createCanvas(600, 400);
  colorMode(RGB);
  
  // Initialize some particles
  for (let i = 0; i < 20; i++) {
    particles.push(createParticle());
  }
  
  // Initialize some smoke
  for (let i = 0; i < 10; i++) {
    smoke.push(createSmoke());
  }
}

function draw() {
  background(25, 25, 60); // Night sky
  
  // Draw stars
  drawStars();
  
  // Draw volcano
  drawVolcano();
  
  // Draw lava flows
  updateLavaFlows();
  
  // Draw particles (lava chunks)
  updateParticles();
  
  // Draw smoke
  updateSmoke();
  
  // Add new particles occasionally
  if (frameCount % 3 === 0) {
    particles.push(createParticle());
  }
  
  // Add new smoke occasionally
  if (frameCount % 5 === 0) {
    smoke.push(createSmoke());
  }
  
  // Add new lava flow occasionally
  if (frameCount % 20 === 0 && random() < 0.5) {
    lavaFlows.push(createLavaFlow());
  }
}

function drawStars() {
  fill(255);
  noStroke();
  for (let i = 0; i < 100; i++) {
    let x = (i * 37) % width;
    let y = (i * 23) % (height/2);
    let size = noise(i * 0.1) * 2;
    ellipse(x, y, size, size);
  }
}

function drawVolcano() {
  // Draw mountain
  fill(60, 50, 40);
  beginShape();
  vertex(-50, height);
  vertex(200, 200);
  vertex(400, 200);
  vertex(650, height);
  endShape(CLOSE);
  
  // Draw crater
  fill(80, 30, 20);
  ellipse(width/2, 200, 200, 40);
  
  // Draw lava in the crater
  fill(255, 80, 0);
  ellipse(width/2, 200, 160, 30);
  
  // Add some lava details
  for (let i = 0; i < 5; i++) {
    let x = width/2 + random(-70, 70);
    let y = 200 + random(-10, 10);
    fill(255, 150, 0, 200);
    ellipse(x, y, random(5, 15), random(3, 8));
  }
}

function createParticle() {
  return {
    x: width/2 + random(-20, 20),
    y: 200,
    vx: random(-2, 2),
    vy: random(-12, -8),
    size: random(5, 15),
    color: color(255, random(100, 200), random(0, 50)),
    gravity: 0.2,
    life: 255
  };
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Apply gravity
    p.vy += p.gravity;
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Add some wiggle
    p.x += random(-0.5, 0.5);
    
    // Draw particle
    fill(p.color);
    noStroke();
    ellipse(p.x, p.y, p.size, p.size);
    
    // Add a glow effect
    fill(255, 150, 0, 50);
    ellipse(p.x, p.y, p.size * 1.5, p.size * 1.5);
    
    // Decrease life
    p.life -= 2;
    
    // Remove dead particles
    if (p.life <= 0 || p.y > height) {
      particles.splice(i, 1);
    }
  }
}

function createSmoke() {
  return {
    x: width/2 + random(-15, 15),
    y: 195,
    vx: random(-0.5, 0.5),
    vy: random(-2, -1),
    size: random(20, 40),
    opacity: random(150, 200),
    expandRate: random(0.3, 0.8),
    life: 255
  };
}

function updateSmoke() {
  for (let i = smoke.length - 1; i >= 0; i--) {
    let s = smoke[i];
    
    // Update position
    s.x += s.vx;
    s.y += s.vy;
    
    // Expand smoke
    s.size += s.expandRate;
    
    // Draw smoke
    fill(100, 100, 100, s.opacity * (s.life/255));
    noStroke();
    ellipse(s.x, s.y, s.size, s.size);
    
    // Decrease life
    s.life -= 1;
    
    // Remove dead smoke
    if (s.life <= 0) {
      smoke.splice(i, 1);
    }
  }
}

function createLavaFlow() {
  return {
    x: width/2 + random(-50, 50),
    y: 200,
    width: random(10, 25),
    speed: random(0.5, 1.5),
    points: [],
    maxLength: random(50, 150)
  };
}

function updateLavaFlows() {
  for (let i = lavaFlows.length - 1; i >= 0; i--) {
    let flow = lavaFlows[i];
    
    // Add a new point to the flow
    if (flow.points.length === 0 || 
        frameCount % 2 === 0 && flow.points.length < flow.maxLength) {
      flow.points.push({
        x: flow.x + random(-5, 5),
        y: flow.y,
        width: flow.width
      });
      flow.y += flow.speed;
    }
    
    // Draw the lava flow
    if (flow.points.length > 1) {
      for (let j = 0; j < flow.points.length - 1; j++) {
        let p1 = flow.points[j];
        let p2 = flow.points[j + 1];
        let alpha = map(j, 0, flow.points.length - 1, 255, 100);
        
        stroke(255, 100, 0, alpha);
        strokeWeight(p1.width);
        line(p1.x, p1.y, p2.x, p2.y);
        
        // Add glow
        stroke(255, 150, 0, alpha * 0.4);
        strokeWeight(p1.width * 1.5);
        line(p1.x, p1.y, p2.x, p2.y);
      }
    }
    
    // Remove flows that have reached their maximum length
    if (flow.points.length >= flow.maxLength) {
      // Decrease width to create cooling effect
      for (let p of flow.points) {
        p.width *= 0.98;
      }
      
      // Remove flow when it becomes too thin
      if (flow.points[0].width < 1) {
        lavaFlows.splice(i, 1);
      }
    }
  }
}
