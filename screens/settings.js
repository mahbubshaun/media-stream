import {
    SettingsDividerShort,
    SettingsDividerLong,
    SettingsEditText,
    SettingsCategoryHeader,
    SettingsSwitch,
    SettingsPicker
  } from "react-native-settings-components";
   
  export default class Sett extends Component {
    constructor() {
      super();
      this.state = {
        username: "",
        allowPushNotifications: false,
        gender: ""
      };
    }
   
    render() {
      <ScrollView
        style={{
          flex: 1,
          backgroundColor:
            Platform.OS === "ios" ? colors.iosSettingsBackground : colors.white
        }}
      >
        <SettingsCategoryHeader
          title={"My Account"}
          textStyle={Platform.OS === "android" ? { color: colors.monza } : null}
        />
        <SettingsDividerLong android={false} />
        <SettingsEditText
          title="Username"
          dialogDescription={"Enter your username."}
          valuePlaceholder="..."
          negativeButtonTitle={"Cancel"}
          buttonRightTitle={"Save"}
          onValueChange={value => {
            console.log("username:", value);
            this.setState({
              username: value
            });
          }}
          value={this.state.username}        
        />
        <SettingsDividerShort />
        <SettingsPicker
          title="Gender"
          dialogDescription={"Choose your gender."}
          options={[
            { label: "...", value: "" },
            { label: "male", value: "male" },
            { label: "female", value: "female" },
            { label: "other", value: "other" }
          ]}
          onValueChange={value => {
            console.log("gender:", value);
            this.setState({
              gender: value
            });
          }}
          value={this.state.gender}
          styleModalButtonsText={{ color: colors.monza }}
        />
        ...
        <SettingsSwitch
          title={"Allow Push Notifications"}
          onValueChange={value => {
            console.log("allow push notifications:", value);
            this.setState({
              allowPushNotifications: value
            });
          }}
          value={this.state.allowPushNotifications}
          trackColor={{
            true: colors.switchEnabled,
            false: colors.switchDisabled,
          }}
        />
        ...
      </ScrollView>;
    }
  }
   
  const colors = {
    white: "#FFFFFF",
    monza: "#C70039",
    switchEnabled: "#C70039",
    switchDisabled: "#efeff3",
    blueGem: "#27139A",
  };