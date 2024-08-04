package com.kloudfox

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity(), DefaultHardwareBackBtnHandler {

    override fun onCreate(savedInstanceState: Bundle?) {
        SplashScreen.show(this)  // Call SplashScreen.show() before super.onCreate()
        super.onCreate(savedInstanceState)
    }

    override fun getMainComponentName(): String {
        return "AwesomeProject"
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : ReactActivityDelegate(this, mainComponentName) {
            override fun getLaunchOptions(): Bundle? {
                return intent.extras
            }

            // Remove the override for invokeDefaultOnBackPressed
            // If needed, add other lifecycle methods here (onPause, onResume, etc.)
        }
    }
}

