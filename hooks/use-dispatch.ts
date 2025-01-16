import { useDispatch as _useDispatch } from 'react-redux';
import { AppDispatch } from '@store/index';

const useDispatch = (): AppDispatch => _useDispatch();

export default useDispatch;
