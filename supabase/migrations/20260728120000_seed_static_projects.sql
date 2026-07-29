-- Seed catalog projects (idempotent by title).
-- Media paths are site-relative; the app resolves them with Vite BASE_URL (GitHub Pages).
-- Run after the schema migration. Safe to re-run: skips existing titles.

INSERT INTO public.projects (
  title, description, tag, tool, category,
  thumbnail_url, video_url, external_link, media, sort_order
)
SELECT * FROM (VALUES
  (
    'Housingless Rolling Stand',
    'Detailed 3D model of a housingless rolling stand used in modern steel rolling mills. Designed for high rigidity, easy roll changes, and improved product tolerances.',
    '3D Model', 'SolidWorks', '3D Models',
    '/pictures/housingless-stand.png', NULL::text, NULL::text,
    '[]'::jsonb, 120
  ),
  (
    'Housingless Stand — Motion Study',
    'Motion study of the housingless rolling stand showing roll adjustment kinematics and clamping behavior under operating conditions.',
    '3D Model', 'SolidWorks Motion', '3D Models',
    '/projects/proj-rolling-mill.webp', '/videos/housingless-stand.mp4', NULL,
    '[]'::jsonb, 110
  ),
  (
    'Start–Stop Shear',
    'Mechanism design and motion simulation of a start–stop shear used to cut hot-rolled bars at line speed with synchronized blade motion.',
    '3D Model', 'SolidWorks Motion', '3D Models',
    '/projects/proj-start-stop-shear.webp', '/videos/start-stop-shear.mp4', NULL,
    '[]'::jsonb, 100
  ),
  (
    'Iris Cap Mechanism',
    'Iris-style aperture mechanism modeled and animated to validate linkage geometry, contact, and synchronized blade motion.',
    '3D Model', 'SolidWorks Motion', '3D Models',
    '/projects/proj-iris-cap.webp', '/videos/iris-cap.mp4', NULL,
    '[]'::jsonb, 90
  ),
  (
    'Winch Assembly Drawing',
    'Production-ready 2D assembly drawing of an industrial winch with full BOM, part weights, and manufacturing notes.',
    '2D Drawing', 'SolidWorks', '2D Drawings',
    '/winch/winch-assembly-1.webp', NULL, NULL,
    '[
      {"type":"image","src":"/winch/winch-assembly-1.webp","caption":"Winch overall assembly — gantry-style structure with bridge, pillars and base, including BOM with part weights."},
      {"type":"image","src":"/winch/winch-assembly-2.webp","caption":"Winch base sub-assembly — detailed exploded view with numbered parts and weight table."}
    ]'::jsonb, 80
  ),
  (
    'Production Line Project',
    'Planning, scheduling and progress control of a full production line installation, including WBS, Gantt chart and resource leveling.',
    'Project Management', 'MS Project', 'Project Management',
    '/projects/proj-gantt-new.webp', NULL, NULL,
    '[]'::jsonb, 70
  ),
  (
    'Conversion of Honda Super Cub C125 to Electric Model MSP',
    'Full project plan for converting a Honda Super Cub C125 to an electric powertrain — WBS, scheduling, and progress tracking in MS Project.',
    'Project Management', 'MS Project', 'Project Management',
    '/honda/honda-cub-msp-1.webp', NULL, NULL,
    '[
      {"type":"image","src":"/honda/honda-cub-msp-1.webp","caption":"WBS & task schedule"},
      {"type":"image","src":"/honda/honda-cub-msp-2.webp","caption":"Gantt chart"}
    ]'::jsonb, 60
  ),
  (
    'Sliding Mode Control of a Robotic Manipulator',
    'Modeling, dynamic simulation and Sliding Mode Control of a multi-link robotic manipulator in MATLAB/Simulink.',
    'MATLAB', 'MATLAB/Simulink', 'MATLAB',
    '/matlab/dexterity-manipulability.webp', '/matlab/part1.mp4', NULL,
    '[
      {"type":"image","src":"/matlab/dexterity-manipulability.webp","caption":"Workspace analysis"},
      {"type":"image","src":"/matlab/simulink-dynamics.webp","caption":"Simulink dynamics"},
      {"type":"image","src":"/matlab/simulink-controllers.webp","caption":"Controller architecture"},
      {"type":"video","src":"/matlab/part1.mp4","caption":"3D simulation"},
      {"type":"video","src":"/matlab/part4-sim.mp4","caption":"Closed-loop response"}
    ]'::jsonb, 50
  ),
  (
    'Robot Path Planning',
    'Path planning and obstacle avoidance for a mobile robot using Python, with visualization of trajectories and cost maps.',
    'Python', 'Python', 'Python',
    '/projects/proj-robot.webp', NULL, NULL,
    '[]'::jsonb, 40
  ),
  (
    'A+A−B+B− Nonstop Cycle',
    'Continuous A+A−B+B− pneumatic sequence implemented in PLC ladder logic, including start/stop interlocks and cycle counter.',
    'PLC', 'PLC Ladder Logic', 'PLC, Hydraulic & Pneumatic',
    '/projects/proj-a-b-nonstop.webp', '/videos/a-b-nonstop.mp4', NULL,
    '[]'::jsonb, 30
  ),
  (
    'Hydraulic Circuit Simulation',
    'Hydraulic circuit designed and simulated in FluidSIM, demonstrating actuator sequencing, pressure regulation and flow control.',
    'Hydraulic', 'FluidSIM', 'PLC, Hydraulic & Pneumatic',
    '/projects/proj-hydraulic-sim.webp', '/videos/hydraulic-sim.mp4', NULL,
    '[]'::jsonb, 20
  ),
  (
    'Pneumatic Sequence Control',
    'Pneumatic sequence controller validated in FluidSIM with sensors and limit switches driving multi-cylinder synchronized motion.',
    'Pneumatic', 'FluidSIM', 'PLC, Hydraulic & Pneumatic',
    '/projects/proj-pneumatic-sim.webp', '/videos/pneumatic-sim.mp4', NULL,
    '[]'::jsonb, 10
  )
) AS v(title, description, tag, tool, category, thumbnail_url, video_url, external_link, media, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.projects p WHERE p.title = v.title
);
