import * as React from 'react'
import { Subtract } from 'utility-types';
import { geoNaturalEarth1 } from 'd3-geo';

export interface IProjectionProps {
	createProjection(center?: [number, number], scale?: number)
}

export const ProjectionWrapper = <P extends IProjectionProps>(Component: React.ComponentType<P>) =>
	class ProjectionWrapperClass extends React.Component<Subtract<P, IProjectionProps>> {
		createProjection(center?: [number, number], scale: number = 100) {
			const base = geoNaturalEarth1()
				.translate([0, 0])
			if (!center)
				return base
			return base.center(center).scale(scale) // translate([translate[0], translate[1]])
		}

		render() {
			return <Component {...this.props} createProjection={(a, b) => this.createProjection(a, b)} />
		}
	}
