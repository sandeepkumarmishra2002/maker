import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Picker, ActivityIndicator, Animated} from 'react-native';
import {ActionButton, Toolbar, BottomNavigation} from 'react-native-material-ui';
import TaskList from '../TaskList/TaskList';
import Template from '../Template/Template';

import { connect } from 'react-redux';
import ConfigCategory from "../ConfigCategory/ConfigCategory";
import * as actions from "../../store/actions";

class ToDo extends Component {
    state = {
        sorting: 'byAZ',
        sortingType: 'ASC',
        tasks: [],
        selectedCategory: 'All',
        loading: true,
        showModal: false,
        scroll: 0,
        fadeAnim: new Animated.Value(1),
    };

    componentDidMount() {
        this.props.onInitTasks();
        this.props.onInitFinished();
        this.props.onInitCategories();
        //if (!this.props.isAuth) this.props.navigation.navigate('Auth');
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.refresh !== this.props.refresh) {
            if (this.state.selectedCategory === 'finished') {
                this.setState({ tasks: this.props.finished, loading: false });
            }
            else {
                this.setState({ tasks: this.props.tasks, loading: false });
            }
        }
    }

    toggleModalHandler = () => {
        const { showModal } = this.state;
        this.setState({ showModal: !showModal });
    };

    deleteAllTask = async () => {
        const {finished} = this.props;
        await finished.forEach(task => {
            this.props.onRemoveTask(task);
        })
    };

    setSortingType = (key) => {
        if (key === this.state.sorting) {
            if (this.state.sortingType === 'ASC') {
                this.setState({ sorting: key, sortingType: 'DESC' });
            } else {
                this.setState({ sorting: key, sortingType: 'ASC' });
            }
        } else {
            this.setState({ sorting: key });
        }
    };

    scrollPosition = (e) => {
        if (e.nativeEvent.contentOffset.y > this.state.scroll+5) {
            this.setState({ scroll: e.nativeEvent.contentOffset.y });
            this.animateDetail(false);
        } else {
            this.setState({ scroll: e.nativeEvent.contentOffset.y });
            this.animateDetail(true);
        }
    };

    animateDetail = (fadeIn) => {
        Animated.timing(this.state.fadeAnim, {
            toValue: fadeIn ? 1.0 : 0.0,
            duration: 200
        }).start();
    };

    selectedCategoryHandler = (category) => {
        const { tasks, finished } = this.props;
        let filterTask = tasks;

        if (category === 'finished') {
            return this.setState({ selectedCategory: category, tasks: finished });
        }
        else if (category === 'new') {
            return this.toggleModalHandler();
        }
        else if (category !== 'All') {
            filterTask = tasks.filter(task => task.category === category);
        }

        return this.setState({ selectedCategory: category, tasks: filterTask });
    };

    render() {
        const {selectedCategory, tasks, loading, showModal, sortingType, sorting, fadeAnim} = this.state;
        const {navigation, categories, finished} = this.props;

        return (
            <Template>
                <Toolbar
                    searchable={{
                        autoFocus: true,
                        placeholder: 'Search task',
                    }}
                    leftElement="menu"
                    onLeftElementPress={() => navigation.navigate('Drawer')}
                    centerElement={
                        <Picker
                            style={styles.picker}
                            selectedValue={selectedCategory}
                            onValueChange={(itemValue, itemIndex) =>
                                this.selectedCategoryHandler(itemValue)
                            }>
                            <Picker.Item
                                color="black"
                                label={`All (${this.props.tasks.length})`}
                                value="All" />
                            {categories.map(cate => {
                                const amountOfTasks = this.props.tasks.filter(task => task.category === cate.name);
                                return <Picker.Item
                                    key={cate.id}
                                    label={`${cate.name} (${amountOfTasks.length})`}
                                    value={cate.name} />
                                })
                            }
                            <Picker.Item
                                color="#939393"
                                value='finished'
                                label={`Finished (${finished.length})`} />
                            <Picker.Item
                                color="#939393"
                                label='New category'
                                value='new' />
                        </Picker>
                    }
                />
                {!loading ?
                <React.Fragment>
                    <View style={styles.container}>
                        <ScrollView onScroll={this.scrollPosition} style={styles.tasks}>
                            <TaskList
                                tasks={tasks}
                                sortingType={sortingType}
                                sorting={sorting}
                                navigation={navigation}
                            />
                        </ScrollView>
                    </View>
                    <Animated.View
                        style={{
                            opacity: fadeAnim
                        }}>
                    {selectedCategory !== 'finished' ?
                        <ActionButton
                            onPress={() => navigation.navigate('ConfigTask')}
                            icon="add"
                        /> :
                        finished.length ?
                        <ActionButton
                            style={{
                                container: {backgroundColor: '#b6c1ce'}
                            }}
                            onPress={() => this.deleteAllTask()}
                            icon="delete-sweep"
                        /> : null
                    }
                    </Animated.View>
                    <BottomNavigation active={sorting}>
                        <BottomNavigation.Action
                            key="byAZ"
                            icon="format-line-spacing"
                            label={ sortingType === 'ASC' ? "A-Z" : "Z-A" }
                            onPress={() => this.setSortingType('byAZ')}
                        />
                        <BottomNavigation.Action
                            key="byDate"
                            icon="insert-invitation"
                            label="Date"
                            onPress={() => this.setSortingType('byDate')}
                        />
                        <BottomNavigation.Action
                            key="byCategory"
                            icon="bookmark-border"
                            label="Category"
                            onPress={() => this.setSortingType('byCategory')}
                        />
                        <BottomNavigation.Action
                            key="byPriority"
                            icon="priority-high"
                            label="Priority"
                            onPress={() => this.setSortingType('byPriority')}
                        />
                    </BottomNavigation>
                </React.Fragment> :
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
                }
                {showModal &&
                <ConfigCategory
                    navigation={navigation}
                    showModal={showModal}
                    toggleModal={this.toggleModalHandler}
                />
                }
            </Template>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    inputContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    tasks: {
        width: "100%",
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 50
    },
    picker: {
        color: 'white'
    }
});

const mapStateToProps = state => {
    return {
        tasks: state.tasks.tasks,
        finished: state.tasks.finished,
        refresh: state.tasks.refresh,
        categories: state.categories.categories,
        isAuth: state.auth.isAuth
    }
};
const mapDispatchToProps = dispatch => {
    return {
        onInitTasks: () => dispatch(actions.initTasks()),
        onInitFinished: () => dispatch(actions.initFinished()),
        onInitCategories: () => dispatch(actions.initCategories()),
        onRemoveTask: (task) => dispatch(actions.removeTask(task)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ToDo);