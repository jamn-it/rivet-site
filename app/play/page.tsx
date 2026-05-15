"use client";

import { useEffect, useRef } from "react";
import {
  Engine,
  Scene,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Vector3,
  StandardMaterial,
  Color3,
  Color4,
  PhysicsImpostor,
} from "@babylonjs/core";
import { Ray } from "@babylonjs/core/Culling/ray";
import { CannonJSPlugin } from "@babylonjs/core/Physics/Plugins/cannonJSPlugin";
import * as CANNON from "cannon-es";

export default function PlayPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    scene.clearColor = new Color4(0.08, 0.08, 0.12, 1);

    const physicsPlugin = new CannonJSPlugin(true, 10, CANNON);
    scene.enablePhysics(new Vector3(0, -9.81, 0), physicsPlugin);

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 1.1;

    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 100, height: 100 },
      scene
    );

    const groundMat = new StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new Color3(0.2, 0.2, 0.25);
    ground.material = groundMat;
    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.9, restitution: 0.05 },
      scene
    );

    const makeBlock = (x: number, y: number, z: number) => {
      const block = MeshBuilder.CreateBox(
        `block-${x}-${y}-${z}-${Math.random()}`,
        { size: 2 },
        scene
      );

      block.position = new Vector3(x, y, z);

      const blockMat = new StandardMaterial("blockMat", scene);
      blockMat.diffuseColor = new Color3(1, 0.8, 0);
      block.material = blockMat;

      block.physicsImpostor = new PhysicsImpostor(
        block,
        PhysicsImpostor.BoxImpostor,
        { mass: 1, friction: 0.8, restitution: 0.05 },
        scene
      );

      return block;
    };

    for (let i = 0; i < 18; i++) {
      makeBlock(Math.random() * 30 - 15, 1, Math.random() * 30 - 15);
    }

    const player = MeshBuilder.CreateSphere(
      "player",
      { diameter: 1 },
      scene
    );
    player.position = new Vector3(0, 2, 0);
    player.isVisible = false;
    player.isPickable = false;

   player.physicsImpostor = new PhysicsImpostor(
  player,
  PhysicsImpostor.SphereImpostor,
  {
    mass: 1,
    friction: 0.2,
    restitution: 0.0,
  },
  scene
);

const physicsBody: any =
  player.physicsImpostor.physicsBody;

physicsBody.linearDamping = 0.9;
physicsBody.angularDamping = 1.0;

physicsBody.fixedRotation = true;

physicsBody.updateMassProperties();

const physicsBody: any =
  player.physicsImpostor.physicsBody;

physicsBody.fixedRotation = true;

physicsBody.updateMassProperties();

    const camera = new FreeCamera(
      "camera",
      new Vector3(0, 0.65, 0),
      scene
    );
    camera.parent = player;
    camera.minZ = 0.05;
    camera.fov = Math.PI / 3;
    scene.activeCamera = camera;

    let yaw = 0;
    let pitch = 0;
    let canJump = false;

    const keys = new Set<string>();

    const onKeyDown = (e: KeyboardEvent) => {
      if (["KeyW", "KeyA", "KeyS", "KeyD", "Space"].includes(e.code)) {
        e.preventDefault();
      }

      keys.add(e.code);

      if (e.code === "Space" && canJump) {
        player.physicsImpostor?.applyImpulse(
          new Vector3(0, 5.5, 0),
          player.getAbsolutePosition()
        );
        canJump = false;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.code);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return;

     yaw += e.movementX * 0.0025;
pitch += e.movementY * 0.0025;

      const limit = 1.45;
      if (pitch > limit) pitch = limit;
      if (pitch < -limit) pitch = -limit;
    };

    const onCanvasClick = () => {
      canvas.requestPointerLock();
    };

    canvas.addEventListener("click", onCanvasClick);
    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const handleResize = () => {
      engine.resize();
    };

    window.addEventListener("resize", handleResize);

    scene.onBeforeRenderObservable.add(() => {
      camera.rotation.x = pitch;
camera.rotation.y = yaw;

      const forward = new Vector3(Math.sin(yaw), 0, Math.cos(yaw));
      const right = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw));

      let moveX = 0;
      let moveZ = 0;

      if (keys.has("KeyW")) moveZ += 1;
      if (keys.has("KeyS")) moveZ -= 1;
      if (keys.has("KeyD")) moveX += 1;
      if (keys.has("KeyA")) moveX -= 1;

      let moveDir = forward.scale(moveZ).add(right.scale(moveX));

      if (moveDir.lengthSquared() > 0) {
        moveDir = moveDir.normalize();
      }

      const currentVel = player.physicsImpostor?.getLinearVelocity();
      const yVel = currentVel?.y ?? 0;

      const speed = 6;
      player.physicsImpostor?.setLinearVelocity(
        new Vector3(moveDir.x * speed, yVel, moveDir.z * speed)
      );

      const ray = new Ray(
        player.position.add(new Vector3(0, -0.45, 0)),
        new Vector3(0, -1, 0),
        0.2
      );

      const hit = scene.pickWithRay(
        ray,
        (mesh) => mesh !== player && mesh !== camera
      );

      canJump = !!hit?.hit;
    });

    engine.runRenderLoop(() => {
      scene.render();
    });

    return () => {
      canvas.removeEventListener("click", onCanvasClick);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", handleResize);

      scene.dispose();
      engine.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
        cursor: "pointer",
      }}
    />
  );
}