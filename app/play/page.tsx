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
  const canvasRef = useRef<HTMLCanvasElement | null>(
    null
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    const engine = new Engine(canvas, true);

    const scene = new Scene(engine);

    scene.clearColor = new Color4(
      0.08,
      0.08,
      0.12,
      1
    );

    // PHYSICS

    const physicsPlugin = new CannonJSPlugin(
      true,
      10,
      CANNON
    );

    scene.enablePhysics(
      new Vector3(0, -20, 0),
      physicsPlugin
    );

    // LIGHT

    const light = new HemisphericLight(
      "light",
      new Vector3(0, 1, 0),
      scene
    );

    light.intensity = 1.1;

    // GROUND

    const ground = MeshBuilder.CreateGround(
      "ground",
      {
        width: 100,
        height: 100,
      },
      scene
    );

    ground.isPickable = true;

    const groundMat = new StandardMaterial(
      "groundMat",
      scene
    );

    groundMat.diffuseColor = new Color3(
      0.2,
      0.2,
      0.25
    );

    ground.material = groundMat;

    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      {
        mass: 0,
        friction: 0.9,
        restitution: 0.05,
      },
      scene
    );

    // BLOCKS

    const makeBlock = (
      x: number,
      y: number,
      z: number
    ) => {
      const block = MeshBuilder.CreateBox(
        `block-${Math.random()}`,
        {
          size: 2,
        },
        scene
      );

      block.position = new Vector3(x, y, z);

      block.isPickable = true;

      const blockMat = new StandardMaterial(
        `blockMat-${Math.random()}`,
        scene
      );

      blockMat.diffuseColor = new Color3(
        1,
        0.8,
        0
      );

      block.material = blockMat;

      block.physicsImpostor = new PhysicsImpostor(
        block,
        PhysicsImpostor.BoxImpostor,
        {
          mass: 1,
          friction: 0.8,
          restitution: 0.05,
        },
        scene
      );

      return block;
    };

    for (let i = 0; i < 18; i++) {
      makeBlock(
        Math.random() * 30 - 15,
        1,
        Math.random() * 30 - 15
      );
    }

    // PLAYER HITBOX

    const player = MeshBuilder.CreateBox(
      "player",
      {
        width: 1,
        depth: 1,
        height: 2,
      },
      scene
    );

    player.position = new Vector3(0, 4, 0);

    player.isVisible = false;

    player.isPickable = false;

    player.physicsImpostor = new PhysicsImpostor(
      player,
      PhysicsImpostor.BoxImpostor,
      {
        mass: 1,
        friction: 0.2,
        restitution: 0,
      },
      scene
    );

    const physicsBody: any =
      player.physicsImpostor.physicsBody;

    physicsBody.fixedRotation = true;

    physicsBody.updateMassProperties();

    // MATERIALS

    const skinMat = new StandardMaterial(
      "skinMat",
      scene
    );

    skinMat.diffuseColor = new Color3(1, 1, 1);

    const torsoMat = new StandardMaterial(
      "torsoMat",
      scene
    );

    torsoMat.diffuseColor = new Color3(
      0.9,
      0.1,
      0.1
    );

    const pantsMat = new StandardMaterial(
      "pantsMat",
      scene
    );

    pantsMat.diffuseColor = new Color3(
      0.1,
      0.1,
      0.1
    );

    // AVATAR ROOT

    const avatarRoot = MeshBuilder.CreateBox(
      "avatarRoot",
      {
        size: 0.01,
      },
      scene
    );

    avatarRoot.isVisible = false;

    // HEAD

    const head = MeshBuilder.CreateBox(
      "head",
      {
        size: 0.8,
      },
      scene
    );

    head.parent = avatarRoot;

    head.position.y = 1.9;

    head.material = skinMat;

    // TORSO

    const torso = MeshBuilder.CreateBox(
      "torso",
      {
        width: 1,
        height: 1,
        depth: 0.6,
      },
      scene
    );

    torso.parent = avatarRoot;

    torso.position.y = 0.9;

    torso.material = torsoMat;

    // LEFT ARM

    const leftArm = MeshBuilder.CreateBox(
      "leftArm",
      {
        width: 0.35,
        height: 1,
        depth: 0.35,
      },
      scene
    );

    leftArm.parent = avatarRoot;

    leftArm.position = new Vector3(
      -0.7,
      0.9,
      0
    );

    leftArm.material = skinMat;

    // RIGHT ARM

    const rightArm = MeshBuilder.CreateBox(
      "rightArm",
      {
        width: 0.35,
        height: 1,
        depth: 0.35,
      },
      scene
    );

    rightArm.parent = avatarRoot;

    rightArm.position = new Vector3(
      0.7,
      0.9,
      0
    );

    rightArm.material = skinMat;

    // LEFT LEG

    const leftLeg = MeshBuilder.CreateBox(
      "leftLeg",
      {
        width: 0.4,
        height: 1,
        depth: 0.4,
      },
      scene
    );

    leftLeg.parent = avatarRoot;

    leftLeg.position = new Vector3(
      -0.25,
      -0.2,
      0
    );

    leftLeg.material = pantsMat;

    // RIGHT LEG

    const rightLeg = MeshBuilder.CreateBox(
      "rightLeg",
      {
        width: 0.4,
        height: 1,
        depth: 0.4,
      },
      scene
    );

    rightLeg.parent = avatarRoot;

    rightLeg.position = new Vector3(
      0.25,
      -0.2,
      0
    );

    rightLeg.material = pantsMat;

    // CAMERA

    const camera = new FreeCamera(
      "camera",
      new Vector3(0, 2, -6),
      scene
    );

    scene.activeCamera = camera;

    let cameraDistance = 6;

    const minZoom = 0.1;

    const maxZoom = 12;

    let currentCameraPos =
      camera.position.clone();

    // CONTROLS

    let yaw = 0;

    let pitch = 0;

    let canJump = false;

    const keys = new Set<string>();

    const onKeyDown = (e: KeyboardEvent) => {
      keys.add(e.code);

      if (e.code === "Space" && canJump) {
        player.physicsImpostor?.applyImpulse(
          new Vector3(0, 7, 0),
          player.getAbsolutePosition()
        );
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.code);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas)
        return;

      yaw += e.movementX * 0.0025;

      pitch += e.movementY * 0.0018;

      const limit = 1.4;

      if (pitch > limit) pitch = limit;

      if (pitch < -limit) pitch = -limit;
    };

    const onCanvasClick = () => {
      canvas.requestPointerLock();
    };

    const onWheel = (e: WheelEvent) => {
      cameraDistance += e.deltaY * 0.01;

      if (cameraDistance < minZoom)
        cameraDistance = minZoom;

      if (cameraDistance > maxZoom)
        cameraDistance = maxZoom;
    };

    canvas.addEventListener(
      "click",
      onCanvasClick
    );

    document.addEventListener(
      "mousemove",
      onMouseMove
    );

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    window.addEventListener(
      "keyup",
      onKeyUp
    );

    window.addEventListener(
      "wheel",
      onWheel
    );

    // LOOP

    scene.onBeforeRenderObservable.add(() => {
      const forward = new Vector3(
        Math.sin(yaw),
        0,
        Math.cos(yaw)
      );

      const right = new Vector3(
        Math.cos(yaw),
        0,
        -Math.sin(yaw)
      );

      let moveX = 0;

      let moveZ = 0;

      if (keys.has("KeyW")) moveZ += 1;

      if (keys.has("KeyS")) moveZ -= 1;

      if (keys.has("KeyD")) moveX += 1;

      if (keys.has("KeyA")) moveX -= 1;

      let moveDir = forward
        .scale(moveZ)
        .add(right.scale(moveX));

      if (moveDir.lengthSquared() > 0) {
        moveDir = moveDir.normalize();
      }

      const currentVel =
        player.physicsImpostor?.getLinearVelocity();

      const yVel = currentVel?.y ?? 0;

      const speed = 12;

      player.physicsImpostor?.setLinearVelocity(
        new Vector3(
          moveDir.x * speed,
          yVel,
          moveDir.z * speed
        )
      );

      // FOLLOW PLAYER

      avatarRoot.position = player.position.clone();

      // ROTATE PLAYER

      if (moveDir.lengthSquared() > 0.01) {
        avatarRoot.rotation.y = Math.atan2(
          moveDir.x,
          moveDir.z
        );

        const walk =
          performance.now() * 0.01;

        leftLeg.rotation.x =
          Math.sin(walk) * 0.7;

        rightLeg.rotation.x =
          -Math.sin(walk) * 0.7;

        leftArm.rotation.x =
          -Math.sin(walk) * 0.7;

        rightArm.rotation.x =
          Math.sin(walk) * 0.7;
      }

      // CAMERA TARGET

      const target = player.position.add(
        new Vector3(0, 1.4, 0)
      );

      let desiredPosition: Vector3;

      // FIRST PERSON

      if (cameraDistance <= 0.3) {
        desiredPosition = player.position.add(
          new Vector3(0, 1.5, 0)
        );

        avatarRoot.setEnabled(false);
      } else {
        avatarRoot.setEnabled(true);

        const offset = new Vector3(
          Math.sin(yaw) * cameraDistance,
          -Math.sin(pitch) *
            cameraDistance *
            0.8,
          Math.cos(yaw) * cameraDistance
        );

        desiredPosition =
          target.subtract(offset);

        // CAMERA COLLISION

        const rayDirection =
          desiredPosition.subtract(target);

        rayDirection.normalize();

        const ray = new Ray(
          target,
          rayDirection,
          cameraDistance
        );

        const hitInfo = scene.pickWithRay(
          ray,
          (mesh) =>
            mesh.isPickable &&
            mesh !== player
        );

        if (
          hitInfo?.hit &&
          hitInfo.pickedPoint
        ) {
          desiredPosition =
            hitInfo.pickedPoint.add(
              rayDirection.scale(-0.3)
            );
        }
      }

      currentCameraPos = Vector3.Lerp(
        currentCameraPos,
        desiredPosition,
        0.15
      );

      camera.position = currentCameraPos;

      const lookTarget = target.add(
        new Vector3(
          Math.sin(yaw),
          -Math.sin(pitch),
          Math.cos(yaw)
        )
      );

      camera.setTarget(lookTarget);

      // GROUND CHECK

      const groundRay = new Ray(
        player.position.add(
          new Vector3(0, -1.05, 0)
        ),
        new Vector3(0, -1, 0),
        0.2
      );

      const hit = scene.pickWithRay(
        groundRay,
        (mesh) => mesh !== player
      );

      canJump = hit?.hit ?? false;
    });

    engine.runRenderLoop(() => {
      scene.render();
    });

    return () => {
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
      }}
    />
  );
}