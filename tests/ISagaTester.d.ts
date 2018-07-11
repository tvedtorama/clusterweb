// Attempt to reference "Task" from redux saga did NOT work 
/// <reference types="redux-saga/effects" />

declare module "redux-saga-tester" {

	type Func0 = () => any;
	type Func1<T1> = (arg1: T1) => any;
	type Func2<T1, T2> = (arg1: T1, arg2: T2) => any;
	type Func3<T1, T2, T3> = (arg1: T1, arg2: T2, arg3: T3) => any;
	type Func4<T1, T2, T3, T4> = (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => any;
	type Func5<T1, T2, T3, T4, T5> = (arg1: T1, arg2: T2, arg3: T3,
									arg4: T4, arg5: T5) => any;
	type Func6Rest<T1, T2, T3, T4, T5, T6> = (arg1: T1, arg2: T2, arg3: T3,
											arg4: T4, arg5: T5, arg6: T6,
											...rest: any[]) => any;

	type CallEffectFn<F extends Function> =
	F | [any, F] // | {context: any, fn: F};
  
  	type CallEffectNamedFn<C extends {[P in Name]: Function},
								Name extends string> =
	[C, Name] // | {context: C, fn: Name};
  
	interface CallEffectFactory<R> {
		(fn: CallEffectFn<Func0>): R;
		<T1>(fn: CallEffectFn<Func1<T1>>,
			 arg1: T1): R;
		<T1, T2>(fn: CallEffectFn<Func2<T1, T2>>,
				 arg1: T1, arg2: T2): R;
		<T1, T2, T3>(fn: CallEffectFn<Func3<T1, T2, T3>>,
					 arg1: T1, arg2: T2, arg3: T3): R;
		<T1, T2, T3, T4>(fn: CallEffectFn<Func4<T1, T2, T3, T4>>,
						 arg1: T1, arg2: T2, arg3: T3, arg4: T4): R;
		<T1, T2, T3, T4, T5>(fn: CallEffectFn<Func5<T1, T2, T3, T4, T5>>,
							 arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): R;
		<T1, T2, T3, T4, T5, T6>(fn: CallEffectFn<Func6Rest<T1, T2, T3, T4, T5, T6>>,
								 arg1: T1, arg2: T2, arg3: T3,
								 arg4: T4, arg5: T5, arg6: T6, ...rest: any[]): R;
	  
/*		<C extends {[P in N]: Func0}, N extends string>(
		  fn: CallEffectNamedFn<C, N>): R;
		<C extends {[P in N]: Func1<T1>}, N extends string,  T1>(
		  fn: CallEffectNamedFn<C, N>,
		  arg1: T1): R;
		<C extends {[P in N]: Func2<T1, T2>}, N extends string, T1, T2>(
		  fn: CallEffectNamedFn<C, N>,
		  arg1: T1, arg2: T2): R;
		<C extends {[P in N]: Func3<T1, T2, T3>}, N extends string,
		 T1, T2, T3>(
		  fn: CallEffectNamedFn<C, N>,
		  arg1: T1, arg2: T2, arg3: T3): R;
		<C extends {[P in N]: Func4<T1, T2, T3, T4>}, N extends string,
		 T1, T2, T3, T4>(
		  fn: CallEffectNamedFn<C, N>,
		  arg1: T1, arg2: T2, arg3: T3, arg4: T4): R;
		<C extends {[P in N]: Func5<T1, T2, T3, T4, T5>}, N extends string,
		 T1, T2, T3, T4, T5>(
		  fn: CallEffectNamedFn<C, N>,
		  arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): R;
		<C extends {[P in N]: Func6Rest<T1, T2, T3, T4, T5, T6>}, N extends string,
		 T1, T2, T3, T4, T5, T6>(
		  fn: CallEffectNamedFn<C, N>,
		  arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6,
		  ...rest: any[]): R; */
	  }

	class SagaTester {
		constructor(init: {initialState?: any, reducers?: {}, options?: any, middlewares?: any[]})
		start: CallEffectFactory<Task>
		dispatch(action)
		/** Returns a promise that will yield on dispatched actions
		 * 
		 * @param pattern Similar to take's pattern
		 * @param futureOnly If true, only return coming actions - otherwise return previous dispatched matches
		 */
		waitFor<T = any>(pattern, futureOnly?: boolean = false): Promise<T>
		getLatestCalledAction<T = any>(): T
		getState<T>(): T
		getCalledActions<T = any>(): T[]
		numCalled(pattern): number
		wasCalled(pattern): boolean 
	}
	export default SagaTester
}
