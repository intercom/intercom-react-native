
require "json"
require File.join(__dir__, "ios", "intercom_ios_sdk")

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
intercom_ios_sdk_version = "19.10.0"
intercom_ios_sdk_sha256 = "86721574d5aa8e9619f1d1805135f28690b8f8e371442a2d008c2e95ed8f0c96"

Pod::Spec.new do |s|
  s.name         = "intercom-react-native"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "15.0" }
  s.source       = { :git => "https://github.com/intercom/intercom-react-native.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm}"
  s.resource_bundles = { 'IntercomFramework' => ['ios/assets/*'] }

  s.pod_target_xcconfig = { "DEFINES_MODULE" => "YES" }

  s.vendored_frameworks = IntercomIosSdk.install_xcframework(
    version: intercom_ios_sdk_version,
    sha256: intercom_ios_sdk_sha256,
    package_root: __dir__
  )
  s.frameworks = ["Foundation", "UIKit", "Accelerate", "Security", "SystemConfiguration", "MobileCoreServices", "ImageIO", "AudioToolbox", "QuartzCore", "CoreGraphics", "Photos", "WebKit"]
  s.libraries = "icucore", "xml2"

  is_new_arch_enabled = ENV["RCT_NEW_ARCH_ENABLED"] == "1"
  folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'


  if defined?(install_modules_dependencies()) != nil
    install_modules_dependencies(s)
    if is_new_arch_enabled then
      s.compiler_flags = folly_compiler_flags
      s.pod_target_xcconfig = {
        "DEFINES_MODULE" => "YES",
        "OTHER_CPLUSPLUSFLAGS" => "-DRCT_NEW_ARCH_ENABLED=1",
        "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\" \"$(PODS_ROOT)/Headers/Private/Yoga\"",
        "CLANG_CXX_LANGUAGE_STANDARD" => "c++17",
      }
    end
  else
    s.dependency "React-Core"
    if is_new_arch_enabled then
      s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
      s.pod_target_xcconfig = {
        "DEFINES_MODULE" => "YES",
        "OTHER_CPLUSPLUSFLAGS" => "-DRCT_NEW_ARCH_ENABLED=1",
        "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\" \"$(PODS_ROOT)/Headers/Private/Yoga\"",
        "CLANG_CXX_LANGUAGE_STANDARD" => "c++17",
      }
      s.dependency "React-Codegen"
      s.dependency "RCT-Folly"
      s.dependency "RCTRequired"
      s.dependency "RCTTypeSafety"
      s.dependency "ReactCommon/turbomodule/core"
    end
  end

end
