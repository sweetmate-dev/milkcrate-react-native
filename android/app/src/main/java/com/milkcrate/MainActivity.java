package com.milkcrate;

import android.os.Bundle;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    private MainApplication mainApp;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Milkcrate";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mainApp = (MainApplication)this.getApplicationContext();
    }

    @Override
    protected void onResume() {
        super.onResume();
        mainApp.setMainActivity(this);
    }
}

