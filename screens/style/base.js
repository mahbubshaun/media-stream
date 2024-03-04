import { StyleSheet, Dimensions } from 'react-native';

export const style = StyleSheet.create({
    main: {
        backgroundColor: '#31364A',
        height: '100%'
    },
    textCenter: {
        textAlign: "center"
    },
    textUppercase: {
        textTransform: "uppercase"
    },
    textLeft: {
        textAlign: "left"
    },
    textRight: {
        textAlign: "right"
    },
    flexboxContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between'
    },
    flexWrap: {
        flexWrap: 'wrap'
    },
    flexColumn: {
        flexDirection: 'column'
    },
    centerAligned: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    verticalMiddle: {
        alignItems: 'center'
    },
    con:{
        flexDirection: "row",
        justifyContent: "space-between",
      

    },
    margin:{
        backgroundColor: '#eddbda',
        marginBottom:40,
    },
    item: {
        flex: 1,

    },
    flexbox: {
        flexGrow: 1,
        alignSelf: 'auto'
    },
    flexStart: {
        justifyContent: 'flex-start',
        alignSelf: 'flex-start'
    },
    flexEnd: {
        justifyContent: 'flex-end',
        alignSelf: 'flex-end'
    },
    alignEnd: {
        alignSelf: 'flex-end'
    },
    fullHeight: {
        height: '100%'
    },
    full: {
        width: '100%'
    },
    half: {
        width: '50%'
    },
    oneThird: {
        width: '33.333%'
    },
    twoThird:{
        width: '66.667%'
    },
    threeFourth: {
        width: "75%"
    },
    oneFourth: {
        width: '25%'
    },
    relative: {
        position: "relative"
    },
    searchBarStyle: {
		margin: 20,
		marginRight: 10,
		borderRadius: 10,
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		flex: 1,
	},
	iconStyle: {
		marginRight: 20,
		borderRadius: 15,
		padding: 15,
	},
	searchBarParentStyle: {
        marginTop: 35,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	filterTitleStyle: {
		color: 'white',
		fontSize: 26,
		fontWeight: "bold",
		textAlign: "center",
		padding: 15,
		letterSpacing: 1.15,
	},
	separatorStyle: {
		borderBottomColor: "white",
		borderBottomWidth: 3,
		flex: 1,
		width: Dimensions.get("window").width * 0.875,
		alignSelf: "center",
	},
	filterSectionStyle: {
		color: 'white',
		fontSize: 24,
		fontWeight: "bold",
		margin: 15,
	},
	imageParentStyle: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
	notFoundTextStyle: {
		fontWeight: "bold",
		fontSize: 26,
		margin: 20,
	},
	descriptionTextStyle: {
		textAlign: "center",
		marginHorizontal: 10,
		fontSize: 16,
		letterSpacing: 0.75,
	},
    border: {
        borderColor: '#ececec',
        borderWidth: 1,
        borderStyle: "solid"    
    },
    sectionBox: {
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 20,
        paddingBottom: 20,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0
    },
    bothsideOverFlow: {
        marginLeft: -15, 
        marginRight: -15,
        paddingLeft: 15
    },
    btn: {
        paddingTop: 13,
        paddingBottom: 13,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10
    },
    btnText: {
        color: '#FFFFFF',
        fontWeight: "700"
    },
    dot: {
        backgroundColor: 'rgba(0, 0, 0, .2)', 
        width: 8, 
        height: 8,
        borderRadius: 4, 
        marginLeft: 3, 
        marginRight: 3, 
        marginTop: 5
    },
    activeDot: {
        backgroundColor: 'rgba(255, 255, 255, .7)', 
        width: 8, 
        height: 8, 
        borderRadius: 4, 
        marginLeft: 3, 
        marginRight: 3, 
        marginTop: 5
    },
    customBack: {
        position: 'absolute',
        top: 40,
        padding: 20,
        width: 100,
        height: 70,
        zIndex: 100,
        // backgroundColor: 'red'
    },
    customBackArrow: {
        width: 15,
        height: 15,
        borderWidth: 2,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        transform: [{ rotate: '-135deg'}]
    },
    pickerText: {
        fontSize: 17,
        fontWeight: "600",
        color: "#ffffff",
        paddingTop: 15
    },
    loadingText: {
        color: "#ffffff",
        fontSize: 17,
        fontWeight: "600"
    }
})