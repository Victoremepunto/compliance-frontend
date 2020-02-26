import toJson from 'enzyme-to-json';

jest.mock('@apollo/react-hooks');
jest.mock('../../Utilities/Dispatcher');

import { useMutation } from '@apollo/react-hooks';
import { dispatchAction } from '../../Utilities/Dispatcher';

import DeletePolicy from './DeletePolicy.js';

describe('DeletePolicy', () => {
    const defaultProps = {
        isModalOpen: true,
        toggle: jest.fn(),
        onDelete: jest.fn(),
        policy: { id: 1, name: 'foo' }
    };

    beforeEach(() => {
        useMutation.mockImplementation((query, options) => {
            return [function() {
                options.onCompleted();
            }];
        });
        dispatchAction.mockImplementation(() => {});
    });

    it('expect to render an open modal without error', () => {
        const component = mount(
            <DeletePolicy { ...defaultProps } />
        );

        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect not to render anything for a closed modal', () => {
        const component = mount(
            <DeletePolicy { ...defaultProps } isModalOpen={ false } />
        );

        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect to call toggle and onDelete when clicked', () => {
        const component = mount(
            <DeletePolicy { ...defaultProps } />
        );

        component.find('button[aria-label="delete"]').simulate('click');
        expect(defaultProps.toggle).toHaveBeenCalled();
        expect(defaultProps.onDelete).toHaveBeenCalled();
        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect to call toggle and onDelete when clicked', () => {
        const mockMutationReturn = jest.fn();
        const expectedArguments = { variables: { input: { id: 1, deleteAllTestResults: true } } };
        useMutation.mockImplementation(() => {
            return [mockMutationReturn];
        });
        const component = mount(
            <DeletePolicy { ...defaultProps } />
        );
        component.find('input[aria-label="delete-all-reports-checkbox"]').simulate('click');
        // Again, somehow a click doesn't trigger a change, therefore manually
        component.find('input[aria-label="delete-all-reports-checkbox"]').simulate('change');
        component.find('button[aria-label="delete"]').simulate('click');

        expect(mockMutationReturn).toHaveBeenCalledWith(expectedArguments);
    });
});
