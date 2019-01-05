package com.xiaolong.shanjixing;

import android.app.Application;

import com.cnull.apkinstaller.ApkInstallerPackage;  
import com.mehcode.reactnative.splashscreen.SplashScreenPackage;
import com.facebook.react.ReactApplication;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnziparchive.RNZipArchivePackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.horcrux.svg.SvgPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.pgsqlite.SQLitePluginPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rnfs.RNFSPackage;
import com.marcshilling.idletimer.IdleTimerPackage;
// import org.pgsqlite.SQLitePluginPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFSPackage(),
            new RNDeviceInfo(),
            new VectorIconsPackage(),
            new RNZipArchivePackage(),
            new RNSpinkitPackage(),
            new RNSoundPackage(),
            new OrientationPackage(),
            new LinearGradientPackage(),
            new RNFetchBlobPackage(),
            new MPAndroidChartPackage(),
            new SQLitePluginPackage(),
            new SplashScreenPackage(),
            new ApkInstallerPackage(),
	    new PickerPackage(),
            new IdleTimerPackage(),
	    new SvgPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
