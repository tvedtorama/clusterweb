import { spring } from "react-motion";

export const slowSpring = (target: number) => spring(target, {stiffness: 20, damping: 15})
export const mediumSpring = (target: number) => spring(target, {stiffness: 50, damping: 15})
