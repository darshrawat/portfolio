# Alche Studio Portfolio: Final Restoration Walkthrough

I have successfully restored your portfolio to a professional, high-performance state. The design is now strictly aligned with the **Alche Studio** aesthetic.

## Key Features & Interactions

### 1. The Glass Monolith (Hero)
- **Centering**: The massive "D" initial is now mathematically centered.
- **Glass Refraction**: Built using `MeshTransmissionMaterial` with 4 samples, thickness of 5, and IOR of 1.6. It correctly lenses the "DARSH" text behind it.
- **Mouse Tracking**: The monolith rotates smoothly as you move your cursor, creating dynamic highlights and glints.

### 2. Orbital Project Carousel
- **Path**: Projects emerge from the **bottom-right**, orbit toward the center, and disappear toward the **top-right**.
- **Physics**: Linked to **Lenis High-Inertia Scroll** for a cinematic, weighted movement.
- **Visibility**: Opacity transitions ensure focus remains on the current project card as it passes the monolith.

### 3. Technical HUD & Environment
- **HUD**: A live telemetry dashboard displays real-time quaternion data from the 3D engine.
- **Grid**: A cylindrical architectural grid grounds the 3D space.
- **Performance**: Optimized to maintain 60FPS by reducing shader samples and decimating geometry.

## How to Present
1.  **Launch**: Double-click `LAUNCH_PORTFOLIO.bat` on your desktop.
2.  **View**: Open [http://localhost:3003](http://localhost:3003).
3.  **Action**: Scroll slowly to show the orbital carousel. Move the mouse to demonstrate the glass refraction.

## Technical Resolution Summary
- **Visibility**: Fixed by migrating to a Native React Three Fiber engine.
- **Lag**: Resolved via shader optimization and telemetry throttling.
- **Alignment**: Corrected using `geometry.center()` for all 3D text elements.

**Your portfolio is stable, centered, and ready for your presentation today.** Good luck!
