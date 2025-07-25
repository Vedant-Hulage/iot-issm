import pandas as pd
import numpy as np

dataset=pd.read_csv("C:/Users/Vedant/Desktop/Crop_recommendation.csv")
X=dataset.iloc[:,0:6].values
y=dataset.iloc[:,-1].values

from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
y = le.fit_transform(y)

from sklearn.model_selection import train_test_split
X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=0.25,random_state=45)

from sklearn.preprocessing import StandardScaler
sc=StandardScaler()
X_train=sc.fit_transform(X_train)
X_test=sc.transform(X_test)

from sklearn.ensemble import RandomForestClassifier
classifier=RandomForestClassifier(n_estimators=10,criterion='entropy',random_state=0)
classifier.fit(X_train,y_train)

y_pred=classifier.predict(X_test)
print(np.concatenate((y_pred.reshape(len(y_pred),1),y_test.reshape(len(y_test),1)),1))

from sklearn.metrics import confusion_matrix,accuracy_score
cm=confusion_matrix(y_test,y_pred)
print(cm)
accuracy_score(y_test,y_pred)

def suggest_crop(N, P, K, temp, humadity, ph):
    input_data = np.array([[N, P, K, temp, humadity, ph]])  # No column names
    input_data = sc.transform(input_data)
    prediction = classifier.predict(input_data)
    return le.inverse_transform(prediction)[0]

# Example prediction
crop = suggest_crop(90, 42, 43, 25.6, 80.0, 6.5)
print(f"Recommended Crop: {crop}")
