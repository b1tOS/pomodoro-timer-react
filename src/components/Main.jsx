import React, { useEffect, useReducer, useRef } from 'react';
import sound from './mixkit-clock-countdown-bleeps-916.wav';

function handler(state, action) {
	switch (action) {
		case 'START_TIMER':
			return {
				...state,
				isCounting: true,
			};
		case 'DECREASE_TIMER':
			return {
				...state,
				timer: state.timer - 1,
			};
		case 'STOP_TIMER':
			return {
				...state,
				isCounting: false,
			};
		case 'RESET_TIMER':
			return {
				...state,
				timer: 1500,
				isCounting: false,
			};
		case 'RELAX_TIMER':
			state.audio.play();
			let now = new Date();
			let date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
			date += ` ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
			let timer;
			timer =
				(state.shortBreaks + 1) % 4 === 0 && state.shortBreaks !== 0
					? 900
					: 300;
			return {
				...state,
				prevResults: [...state.prevResults, date],
				shortBreaks: state.shortBreaks + 1,
				timer: timer,
				isRelax: true,
				isCounting: false,
			};
		case 'WORK_TIMER':
			state.audio.play();
			return {
				...state,
				timer: 1500,
				isRelax: false,
				isCounting: false,
			};

		default:
			break;
	}
}

function Main() {
	const [{ timer, isCounting, isRelax, prevResults }, dispatch] = useReducer(
		handler,
		{
			timer: 1500,
			isCounting: false,
			isRelax: false,
			audio: new Audio(sound),
			prevResults: !localStorage.getItem('results')
				? []
				: JSON.parse(localStorage.getItem('results')),
			shortBreaks: 0,
		}
	);

	const timerInterval = useRef(null);

	const startTimer = () => {
		timerInterval.current = setInterval(() => {
			dispatch('DECREASE_TIMER');
		}, 1000);
		dispatch('START_TIMER');
	};

	const stopTimer = () => {
		clearInterval(timerInterval.current);
		dispatch('STOP_TIMER');
	};

	const handleReset = () => {
		clearInterval(timerInterval.current);
		dispatch('RESET_TIMER');
	};

	useEffect(() => {
		if (timer === 0 && !isRelax) {
			dispatch('RELAX_TIMER');
			return;
		} else if (timer === 0 && isRelax) {
			dispatch('WORK_TIMER');
			return;
		}
	}, [timer]);

	useEffect(() => {
		if (prevResults.length !== 0)
			localStorage.setItem('results', JSON.stringify(prevResults));
	}, [prevResults]);

	return (
		<div className='main-block'>
			<i className='large material-icons'>timer</i>
			<div>
				<p className='timer grey-text text-lighten-4'>{`${String(
					parseInt(timer / 60)
				).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}</p>
				<div>
					{!isCounting ? (
						<a
							className='waves-effect waves-light btn'
							href='#!'
							onClick={startTimer}
						>
							Start
						</a>
					) : (
						<a
							className='waves-effect waves-light btn'
							href='#!'
							onClick={stopTimer}
						>
							Stop
						</a>
					)}
					<a
						className='waves-effect waves-light btn'
						href='#!'
						onClick={handleReset}
					>
						Reset
					</a>
				</div>
			</div>
			<div></div>
		</div>
	);
}

export { Main };
