const containerEl = id('container');
const fpsEl = id('fps');

const COLORS = {
  magenta: '#f27',
  green: '#ad3',
  blue: '#6de',
}

const FRAMESKIP = 2;

// I guess we don't have window.innerWidth?
const WIDTH = 1000;
const HEIGHT = 1000;
const NUM_PARTICLES = 1500;

// Create a physics instance which uses the Verlet integration method
const physics = new Physics();
physics.integrator = new Verlet();

const mouseRepulsion = new Attraction();
mouseRepulsion.setRadius(200);
mouseRepulsion.strength = -1000;

const mouseAttraction = new Attraction();
mouseAttraction.strength = 200;

const updateForce = (x, y) => {
  mouseAttraction.target.x = x;
  mouseAttraction.target.y = y;
  mouseRepulsion.target.x = x;
  mouseRepulsion.target.y = y;
};

// Create new particle element and particle object.
const createParticle = (x, y) => {
  const particle = new Particle(0.1);
  particle.setRadius(random(1, 5));

  const position = new Vector(x, y);
  particle.moveTo(position);

  particle.behaviours.push(mouseAttraction, mouseRepulsion);

  // Init element with some basic styles.
  const element = el(containerEl, 'div', particle.id, {particle: true});
  style(element, {
    background: getRandomValue(COLORS),
    left: px(x),
    top: px(y),
    width: px(particle.radius * 2),
    height: px(particle.radius * 2)
  });

  return particle;
};

// Create a bunch of particles
const particles = times(NUM_PARTICLES, _ =>
  createParticle(random(0, WIDTH - 10), random(0, HEIGHT - 10)));

physics.particles = particles;

// Set force to random location to begin with.
updateForce(random(0, WIDTH - 10), random(0, HEIGHT - 10));

// @note Servo does not bubble events or dispatch to `window` or `document` yet.
// Set listeners directly on element (in this case, `containerEl`).
events(containerEl, {
  mousemove(event) {
    updateForce(event.clientX, event.clientY);
  },
  mousedown(event) {
    mouseRepulsion.setRadius(300);
  },
  mouseup(event) {
    mouseRepulsion.setRadius(200);
  }
});

const now = () => {
  return 'performance' in window ? window.performance.now() : Date.now();
}

var fpsSum = 0, fpsCount = 0;
var frameCount = 0;
loop((frames, t, dt) => {
  if (frames++ % FRAMESKIP == 0) {
    // Advance physics simulation.
    physics.step();

    physics.particles.forEach(particle => {
      pos2d(id(particle.id), particle.pos.x, particle.pos.y);
    });
  }

  // Calc delta between last and current frame start
  // + delta between frame start and frame end.
  const fps = Math.round(1000 / (dt + (now() - t)));
  fpsSum += fps;
  fpsCount++;
  const averageFPS = Math.round(fpsSum / fpsCount * 10.0) / 10.0;
  text(fpsEl, `Current FPS: ${fps} Average FPS: ${averageFPS}`);
});
