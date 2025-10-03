import React, { useMemo } from 'react';
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	Pressable,
} from 'react-native';
import { COLORS } from '../../constants/colors';

const DEFAULT_TIME_OPTIONS = [30, 60, 90, 120, 150, 180];

const TimePickerModal = ({
	isVisible,
	onClose,
	onSelectTime,
	initialValue = 30,
	timeOptions,
}) => {
	const options = useMemo(() => {
		if (Array.isArray(timeOptions) && timeOptions.length > 0) {
			return timeOptions;
		}
		if (DEFAULT_TIME_OPTIONS.includes(initialValue)) {
			return DEFAULT_TIME_OPTIONS;
		}
		return [...DEFAULT_TIME_OPTIONS, initialValue].sort((a, b) => a - b);
	}, [timeOptions, initialValue]);

	const handleSelect = (minutes) => {
		if (typeof onSelectTime === 'function') {
			onSelectTime(minutes);
		}
		if (typeof onClose === 'function') {
			onClose();
		}
	};

	return (
		<Modal
			visible={!!isVisible}
			animationType="slide"
			transparent
			onRequestClose={onClose}
		>
			<Pressable style={styles.overlay} onPress={onClose}>
				<Pressable style={styles.content} onPress={(event) => event.stopPropagation()}>
					<Text style={styles.title}>Selecciona el tiempo</Text>
					<FlatList
						data={options}
						keyExtractor={(item) => item.toString()}
						renderItem={({ item }) => {
							const isActive = item === initialValue;
							return (
								<TouchableOpacity
									style={[styles.option, isActive && styles.optionActive]}
									onPress={() => handleSelect(item)}
								>
									<Text style={[styles.optionText, isActive && styles.optionTextActive]}>
										{item}
									</Text>
								</TouchableOpacity>
							);
						}}
						ItemSeparatorComponent={() => <View style={styles.separator} />}
					/>
					<TouchableOpacity style={styles.cancelButton} onPress={onClose}>
						<Text style={styles.cancelText}>Cancelar</Text>
					</TouchableOpacity>
				</Pressable>
			</Pressable>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'center',
		paddingHorizontal: 24,
	},
	content: {
		backgroundColor: COLORS.white,
		borderRadius: 16,
		paddingVertical: 20,
		paddingHorizontal: 18,
		maxHeight: '70%',
		elevation: 8,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.text,
		textAlign: 'center',
		marginBottom: 12,
	},
	option: {
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderRadius: 12,
		backgroundColor: COLORS.background,
	},
	optionActive: {
		backgroundColor: COLORS.primary,
	},
	optionText: {
		fontSize: 16,
		fontWeight: '500',
		color: COLORS.text,
		textAlign: 'center',
	},
	optionTextActive: {
		color: COLORS.white,
	},
	separator: {
		height: 8,
	},
	cancelButton: {
		marginTop: 18,
		alignSelf: 'center',
		paddingVertical: 10,
		paddingHorizontal: 16,
	},
	cancelText: {
		color: COLORS.textSecondary,
		fontSize: 16,
		fontWeight: '500',
	},
});

export default TimePickerModal;
